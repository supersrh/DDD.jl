@inline function calcSelfForce(
    dlnParams::DislocationP,
    matParams::MaterialP,
    network::DislocationNetwork,
)

    μ = matParams.μ
    ν = matParams.ν
    omNuInv = 1 / (1 - ν)
    E = matParams.E
    a = dlnParams.coreRad

    idx = network.segIdx
    coord = network.coord
    # Un normalised segment vectors.
    bVec = network.bVec[idx[:, 1], :]
    tVec = coord[idx[:, 3], :] - coord[idx[:, 2], :]

    # Finding the norm of each line vector.
    L = dimNorm(tVec; dims = 2)
    Linv = @. 1 / L
    # Finding the non-singular norm.
    La = @. sqrt(L * L + a * a)

    # Normalised the dislocation network vector, the sum of all the segment vectors has norm 1.
    tVec = @. tVec * Linv

    # Screw component, scalar projection of bVec onto t.
    # bScrew[i] = bVec[i,:] ⋅ t[i,:]
    bScrew = dimDot(bVec, tVec; dims = 2)

    # Edge component, vector rejection of bVec onto t.
    # bEdgeVec[i, :] = bVec[i,:] - (bVec[i,:] ⋅ t[i,:]) t
    bEdgeVec = @. bVec - bScrew * tVec
    # Finding the norm squared of each edge component.
    # bEdgeSq[i] = bEdgeVec[i,:] ⋅ bEdgeVec[i,:]
    bEdgeSq = dimDot(bEdgeVec, bEdgeVec; dims = 2)

    #=
        A. Arsenlis et al, Modelling Simul. Mater. Sci. Eng. 15 (2007)
        553?595: gives this expression in appendix A p590
        f^{s}_{43} = -(μ/(4π)) [ t × (t × b)](t ⋅ b) { v/(1-v) ( ln[
        (L_a + L)/a] - 2*(L_a - a)/L ) - (L_a - a)^2/(2La*L) }

    tVec × (tVec × bVec)    = tVec (tVec ⋅ bVec) - bVec (tVec ⋅ tVec)
                            = tVec * bScrew - bVec
                            = - bEdgeVec
    =#
    # Torsional component of the elastic self interaction force. This is the scalar component of the above equation.
    LaMa = @. La - a
    tor = @. (μ / (4π)) *
       bScrew *
       (
           ν * omNuInv * (log((La + L) / a) - 2 * LaMa * Linv) -
           LaMa^2 / (2 * La * L)
       )

    # Torsional component of core self interaction.
    torCore = @. 2 * E * ν * omNuInv * bScrew
    torTot = @. tor + torCore

    # Longitudinal component of core self interaction.
    lonCore = @. (bScrew^2 + bEdgeSq * omNuInv) * E

    # Force on node 2 = -Force on node 1.
    f2 = @. torTot * bEdgeVec - lonCore * tVec
    f1 = -f2

    return f1, f2
end

"""
!!! Note
    This function is based on the SegSegForces function by A. Arsenlis et al. It is optimised for speed and reusability.
```
```
 It implements the analytical solution of the force between two dislocation segments. Details are found in Appendix A.1. in ["Enabling Strain Hardening Simulations with Dislocation Dynamics" by A. Arsenlis et al.](https://doi.org/10.1088%2F0965-0393%2F15%2F6%2F001)

At a high level this works by creating a local coordinate frame using the line directions of the dislocation segments and a vector orthogonal to them. The line integrals are then evaluated parametrically utilising this local coordinate. BibTex citation here:

@article{Arsenlis_2007,
	doi = {10.1088/0965-0393/15/6/001},
	url = {https://doi.org/10.1088%2F0965-0393%2F15%2F6%2F001},
	year = 2007,
	month = {jul},
	publisher = {{IOP} Publishing},
	volume = {15},
	number = {6},
	pages = {553--595},
	author = {A Arsenlis and W Cai and M Tang and M Rhee and T Oppelstrup and G Hommes and T G Pierce and V V Bulatov},
	title = {Enabling strain hardening simulations with dislocation dynamics},
	journal = {Modelling and Simulation in Materials Science and Engineering},
	abstract = {Numerical algorithms for discrete dislocation dynamics simulations are investigated for the purpose of enabling strain hardening simulations of single crystals on massively parallel computers. The algorithms investigated include the calculation of forces, the equations of motion, time integration, adaptive mesh refinement, the treatment of dislocation core reactions and the dynamic distribution of data and work on parallel computers. A simulation integrating all these algorithmic elements using the Parallel Dislocation Simulator (ParaDiS) code is performed to understand their behaviour in concert and to evaluate the overall numerical performance of dislocation dynamics simulations and their ability to accumulate percent of plastic strain.}
}
"""
@inline function calcSegSegForce(
    dlnParams::DislocationP,
    matParams::MaterialP,
    network::DislocationNetwork,
)
    μ = matParams.μ
    ν = matParams.ν
    a = dlnParams.coreRad
    # Constants.
    aSq = a^2
    μ4π = μ / (4π)
    μ8π = μ4π / 2
    μ8πaSq = aSq * μ8π
    μ4πν = μ4π / (1 - ν)
    μ4πνaSq = aSq * μ4πν

    # Un normalised segment vectors.
    numSegs = network.numSeg
    idx = network.segIdx
    coord = network.coord
    bVec = network.bVec[idx[:, 1], :]
    node1 = coord[idx[:, 2], :]
    node2 = coord[idx[:, 3], :]

    SegSegForce = zeros(numSegs, 3, 2)

    @inbounds for i = 1:numSegs
        b1 = (bVec[i, 1], bVec[i, 2], bVec[i, 3])
        n11 = (node1[i, 1], node1[i, 2], node1[i, 3])
        n12 = (node2[i, 1], node2[i, 2], node2[i, 3])
        t1 = (n12[1] - n11[1], n12[2] - n11[2], n12[3] - n11[3])
        t1N = 1 / sqrt(t1[1] * t1[1] + t1[2] * t1[2] + t1[3] * t1[3])
        t1 = @. t1 * t1N
        for j = (i + 1):numSegs
            b2 = (bVec[j, 1], bVec[j, 2], bVec[j, 3])
            n21 = (node1[j, 1], node1[j, 2], node1[j, 3])
            n22 = (node2[j, 1], node2[j, 2], node2[j, 3])
            t2 = (n22[1] - n21[1], n22[2] - n21[2], n22[3] - n21[3])
            t2N = 1 / sqrt(t2[1] * t2[1] + t2[2] * t2[2] + t2[3] * t2[3])
            t2 = @. t2 * t2N

            c = t2[1] * t1[1] + t2[2] * t1[2] + t2[3] * t1[3]
            cSq = c^2
            omcSq = 1 - cSq
            if omcSq > eps(Float64)
                Fnode1, Fnode2, Fnode3, Fnode4 = calcSegSegForce(
                    aSq,
                    μ4π,
                    μ8π,
                    μ8πaSq,
                    μ4πν,
                    μ4πνaSq,
                    b1,
                    t1,
                    t1N,
                    n11,
                    n12,
                    b2,
                    t2,
                    t2N,
                    n21,
                    n22,
                    c,
                    cSq,
                    omcSq,
                )
                SegSegForce[i, :, 1] .+= Fnode1
                SegSegForce[j, :, 1] .+= Fnode3
                SegSegForce[i, :, 2] .+= Fnode2
                SegSegForce[j, :, 2] .+= Fnode4
            else
                #     Fnode1, Fnode2, Fnode3, Fnode4 = calcSegSegForce(
                #         aSq,
                #         μ4π,
                #         μ8π,
                #         μ8πaSq,
                #         μ4πν,
                #         μ4πνaSq,
                #         b1,
                #         t1,
                #         t1N,
                #         n11,
                #         n12,
                #         b2,
                #         t2,
                #         t2N,
                #         n21,
                #         n22,
                #     )
            end

        end
    end
    return SegSegForce
end
@inline function calcSegSegForce(
    aSq::T1,
    μ4π::T1,
    μ8π::T1,
    μ8πaSq::T1,
    μ4πν::T1,
    μ4πνaSq::T1,
    b1::T2,
    t1::T2,
    t1N::T1,
    n11::T2,
    n12::T2,
    b2::T2,
    t2::T2,
    t2N::T1,
    n21::T2,
    n22::T2,
    c::T1,
    cSq::T1,
    omcSq::T1,
) where {T1 <: Float64, T2 <: NTuple{N, <:Float64} where {N}}
    # V = zeros(3, 17)
    # Fint = zeros(11)
    # Fnode = zeros(3, 4)

    # Single cross products.
    t2ct1 = (
        t2[2] * t1[3] - t2[3] * t1[2],
        t2[3] * t1[1] - t2[1] * t1[3],
        t2[1] * t1[2] - t2[2] * t1[1],
    )

    t1ct2 = .-t2ct1

    b2ct2 = (
        b2[2] * t2[3] - b2[3] * t2[2],
        b2[3] * t2[1] - b2[1] * t2[3],
        b2[1] * t2[2] - b2[2] * t2[1],
    )

    b1ct1 = (
        b1[2] * t1[3] - b1[3] * t1[2],
        b1[3] * t1[1] - b1[1] * t1[3],
        b1[1] * t1[2] - b1[2] * t1[1],
    )

    # Dot products.
    t2db2 = dot(t2, b2)
    t2db1 = dot(t2, b1)
    t1db2 = dot(t1, b2)
    t1db1 = dot(t1, b1)

    # Cross dot products.
    t2ct1db2 = dot(t2ct1, b2)
    t1ct2db1 = dot(t1ct2, b1)
    b1ct1db2 = dot(b1ct1, b2)
    b2ct2db1 = dot(b2ct2, b1)

    # Double cross products.
    t2ct1ct2 = (t1[1] - c * t2[1], t1[2] - c * t2[2], t1[3] - c * t2[3])
    t1ct2ct1 = (t2[1] - c * t1[1], t2[2] - c * t1[2], t2[3] - c * t1[3])
    t2cb1ct2 =
        (b1[1] - t2db1 * t2[1], b1[2] - t2db1 * t2[2], b1[3] - t2db1 * t2[3])
    t1cb2ct1 =
        (b2[1] - t1db2 * t1[1], b2[2] - t1db2 * t1[2], b2[3] - t1db2 * t1[3])
    b1ct1ct2 = (
        t2db1 * t1[1] - c * b1[1],
        t2db1 * t1[2] - c * b1[2],
        t2db1 * t1[3] - c * b1[3],
    )
    b2ct2ct1 = (
        t1db2 * t2[1] - c * b2[1],
        t1db2 * t2[2] - c * b2[2],
        t1db2 * t2[3] - c * b2[3],
    )

    # Double cross product dot product.
    t2ct1cb1dt1 = t2db1 - t1db1 * c
    t1ct2cb2dt2 = t1db2 - t2db2 * c
    t2ct1cb1db2 = t2db1 * t1db2 - t1db1 * t2db2

    omcSqI = 1 / omcSq

    # Integration limits for local coordinates.
    R1 = (n21[1] - n11[1], n21[2] - n11[2], n21[3] - n11[3])
    R2 = (n22[1] - n12[1], n22[2] - n12[2], n22[3] - n12[3])
    d = dot(R2, t2ct1) * omcSqI

    μ4πd = μ4π * d
    μ8πd = μ8π * d
    μ4πνd = μ4πν * d
    μ4πνdSq = μ4πνd * d
    μ4πνdCu = μ4πνdSq * d
    μ4πνaSqd = μ4πνaSq * d
    μ8πaSqd = μ8πaSq * d

    lim11 = dot(R1, t1)
    lim12 = dot(R1, t2)
    lim21 = dot(R2, t1)
    lim22 = dot(R2, t2)

    x1 = (lim12 - c * lim11) * omcSqI
    x2 = (lim22 - c * lim21) * omcSqI
    y1 = (lim11 - c * lim12) * omcSqI
    y2 = (lim21 - c * lim22) * omcSqI

    integ = SegSegInteg(aSq, d, c, cSq, omcSq, omcSqI, x1, y1)
    integ = integ .- SegSegInteg(aSq, d, c, cSq, omcSq, omcSqI, x1, y2)
    integ = integ .- SegSegInteg(aSq, d, c, cSq, omcSq, omcSqI, x2, y1)
    integ = integ .+ SegSegInteg(aSq, d, c, cSq, omcSq, omcSqI, x2, y2)

    # seg 1, nodes 2-1
    tmp1 = t1db2 * t2db1 + t2ct1cb1db2
    V1 = @. tmp1 * t2ct1
    V2 = @. b1ct1 * t1ct2cb2dt2
    V3 = @. t1ct2 * b1ct1db2 - t1cb2ct1 * t2db1
    V4 = @. -b1ct1 * t2ct1db2
    V5 = @. b2ct2ct1 * t2db1 - t1ct2 * b2ct2db1

    tmp1 = μ4πνd * t1ct2db1
    tmp2 = μ4πνd * b2ct2db1
    V7 = @. μ4πd * V1 - μ4πνd * V2 + tmp1 * b2ct2ct1 + tmp2 * t1ct2ct1

    tmp1 = μ4πν * t2db1
    tmp2 = μ4πν * b2ct2db1
    V8 = @. μ4π * V5 - tmp1 * b2ct2ct1 + tmp2 * t1ct2

    tmp1 = μ4πν * t1db1
    V9 = @. -tmp1 * b2ct2ct1 + μ4π * V3 - μ4πν * V4

    tmp1 = μ4πνdCu * t1ct2cb2dt2 * t1ct2db1
    V10 = @. μ8πaSqd * V1 - μ4πνaSqd * V2 - tmp1 * t1ct2ct1

    tmp1 = μ4πνdSq * t1ct2cb2dt2 * t2db1
    tmp2 = μ4πνdSq * t1ct2cb2dt2 * t1ct2db1
    V11 = @. μ8πaSq * V5 + tmp1 * t1ct2ct1 - tmp2 * t1ct2

    tmp1 = μ4πνdSq * (t2ct1db2 * t1ct2db1 + t1ct2cb2dt2 * t1db1)
    V12 = @. μ8πaSq * V3 - μ4πνaSq * V4 + tmp1 * t1ct2ct1

    tmp1 = μ4πνd * (t1ct2cb2dt2 * t1db1 + t2ct1db2 * t1ct2db1)
    tmp2 = μ4πνd * t2ct1db2 * t2db1
    V13 = @. tmp1 * t1ct2 - tmp2 * t1ct2ct1

    tmp1 = μ4πνd * t1ct2cb2dt2 * t2db1
    V14 = @. tmp1 * t1ct2

    tmp1 = μ4πνd * t2ct1db2 * t1db1
    V15 = @. -tmp1 * t1ct2ct1

    tmp1 = @. μ4πν * t2ct1db2 * t1ct2
    V16 = @. -tmp1 * t2db1
    V17 = @. -tmp1 * t1db1

    Fint1 = integ[3] - y2 * integ[1]
    Fint2 = integ[4] - y2 * integ[2]
    Fint3 = integ[6] - y2 * integ[3]
    Fint4 = integ[9] - y2 * integ[7]
    Fint5 = integ[10] - y2 * integ[8]
    Fint6 = integ[12] - y2 * integ[9]
    Fint7 = integ[14] - y2 * integ[10]
    Fint8 = integ[13] - y2 * integ[11]
    Fint9 = integ[17] - y2 * integ[12]
    Fint10 = integ[15] - y2 * integ[13]
    Fint11 = integ[19] - y2 * integ[14]

    Fnode1 = @. (
        V7 * Fint1 +
        V8 * Fint2 +
        V9 * Fint3 +
        V10 * Fint4 +
        V11 * Fint5 +
        V12 * Fint6 +
        V13 * Fint7 +
        V14 * Fint8 +
        V15 * Fint9 +
        V16 * Fint10 +
        V17 * Fint11
    ) * t1N

    Fint1 = y1 * integ[1] - integ[3]
    Fint2 = y1 * integ[2] - integ[4]
    Fint3 = y1 * integ[3] - integ[6]
    Fint4 = y1 * integ[7] - integ[9]
    Fint5 = y1 * integ[8] - integ[10]
    Fint6 = y1 * integ[9] - integ[12]
    Fint7 = y1 * integ[10] - integ[14]
    Fint8 = y1 * integ[11] - integ[13]
    Fint9 = y1 * integ[12] - integ[17]
    Fint10 = y1 * integ[13] - integ[15]
    Fint11 = y1 * integ[14] - integ[19]

    Fnode2 = @. (
        V7 * Fint1 +
        V8 * Fint2 +
        V9 * Fint3 +
        V10 * Fint4 +
        V11 * Fint5 +
        V12 * Fint6 +
        V13 * Fint7 +
        V14 * Fint8 +
        V15 * Fint9 +
        V16 * Fint10 +
        V17 * Fint11
    ) * t1N

    # Seg 2 (nodes 4-3)
    tmp1 = t2db1 * t1db2 + t2ct1cb1db2
    V1 = @. tmp1 * t1ct2
    V2 = @. b2ct2 * t2ct1cb1dt1
    V3 = @. t2ct1 * b1ct1db2 - b1ct1ct2 * t1db2
    V5 = @. t2cb1ct2 * t1db2 - t2ct1 * b2ct2db1
    V6 = @. b2ct2 * t1ct2db1

    tmp1 = μ4πνd * t2ct1db2
    tmp2 = μ4πνd * b1ct1db2
    V7 = @. μ4πd * V1 - μ4πνd * V2 + tmp1 * b1ct1ct2 + tmp2 * t2ct1ct2

    tmp1 = μ4πν * t2db2
    V8 = @. tmp1 * b1ct1ct2 + μ4π * V5 - μ4πν * V6

    tmp1 = μ4πν * t1db2
    tmp2 = μ4πν * b1ct1db2
    V9 = @. μ4π * V3 + tmp1 * b1ct1ct2 - tmp2 * t2ct1

    tmp1 = μ4πνdCu * t2ct1cb1dt1 * t2ct1db2
    V10 = @. μ8πaSqd * V1 - μ4πνaSqd * V2 - tmp1 * t2ct1ct2

    tmp1 = μ4πνdSq * (t1ct2db1 * t2ct1db2 + t2ct1cb1dt1 * t2db2)
    V11 = @. μ8πaSq * V5 - μ4πνaSq * V6 - tmp1 * t2ct1ct2

    tmp1 = μ4πνdSq * t2ct1cb1dt1 * t1db2
    tmp2 = μ4πνdSq * t2ct1cb1dt1 * t2ct1db2
    V12 = @. μ8πaSq * V3 - tmp1 * t2ct1ct2 + tmp2 * t2ct1

    tmp1 = μ4πνd * (t2ct1cb1dt1 * t2db2 + t1ct2db1 * t2ct1db2)
    tmp2 = μ4πνd * t1ct2db1 * t1db2
    V13 = @. tmp1 * t2ct1 - tmp2 * t2ct1ct2

    tmp1 = μ4πνd * t1ct2db1 * t2db2
    V14 = @. -tmp1 * t2ct1ct2

    tmp1 = μ4πνd * t2ct1cb1dt1 * t1db2
    V15 = @. tmp1 * t2ct1

    tmp1 = @. μ4πν * t1ct2db1 * t2ct1
    V16 = @. tmp1 * t2db2
    V17 = @. tmp1 * t1db2

    Fint1 = x2 * integ[1] - integ[2]
    Fint2 = x2 * integ[2] - integ[5]
    Fint3 = x2 * integ[3] - integ[4]
    Fint4 = x2 * integ[7] - integ[8]
    Fint5 = x2 * integ[8] - integ[11]
    Fint6 = x2 * integ[9] - integ[10]
    Fint7 = x2 * integ[10] - integ[13]
    Fint8 = x2 * integ[11] - integ[16]
    Fint9 = x2 * integ[12] - integ[14]
    Fint10 = x2 * integ[13] - integ[18]
    Fint11 = x2 * integ[14] - integ[15]

    Fnode3 = @. (
        V7 * Fint1 +
        V8 * Fint2 +
        V9 * Fint3 +
        V10 * Fint4 +
        V11 * Fint5 +
        V12 * Fint6 +
        V13 * Fint7 +
        V14 * Fint8 +
        V15 * Fint9 +
        V16 * Fint10 +
        V17 * Fint11
    ) .* t2N

    Fint1 = integ[2] - x1 * integ[1]
    Fint2 = integ[5] - x1 * integ[2]
    Fint3 = integ[4] - x1 * integ[3]
    Fint4 = integ[8] - x1 * integ[7]
    Fint5 = integ[11] - x1 * integ[8]
    Fint6 = integ[10] - x1 * integ[9]
    Fint7 = integ[13] - x1 * integ[10]
    Fint8 = integ[16] - x1 * integ[11]
    Fint9 = integ[14] - x1 * integ[12]
    Fint10 = integ[18] - x1 * integ[13]
    Fint11 = integ[15] - x1 * integ[14]

    Fnode4 = @. (
        V7 * Fint1 +
        V8 * Fint2 +
        V9 * Fint3 +
        V10 * Fint4 +
        V11 * Fint5 +
        V12 * Fint6 +
        V13 * Fint7 +
        V14 * Fint8 +
        V15 * Fint9 +
        V16 * Fint10 +
        V17 * Fint11
    ) .* t2N

    return Fnode1, Fnode2, Fnode3, Fnode4
end

# @inline function calcSegSegForce(
#     aSq::T1,
#     μ4π::T1,
#     μ8π::T1,
#     μ8πaSq::T1,
#     μ4πν::T1,
#     μ4πνaSq::T1,
#     b1::T2,
#     t1::T2,
#     t1N::T1,
#     n11::T2,
#     n12::T2,
#     b2::T2,
#     t2::T2,
#     t2N::T1,
#     n21::T2,
#     n22::T2,
# ) where {T1 <: Float64, T2 <: AbstractVector{<:Float64}}
#     return [0.0; 0.0; 0.0], [0.0; 0.0; 0.0], [0.0; 0.0; 0.0], [0.0; 0.0; 0.0]
# end

@inline function SegSegInteg(
    aSq::T1,
    d::T1,
    c::T1,
    cSq::T1,
    omcSq::T1,
    omcSqI::T1,
    x::T1,
    y::T1,
) where {T1 <: Float64}

    # integ = zeros(19)

    aSq_dSq = aSq + d^2 * omcSqI
    xSq = y^2
    ySq = x^2
    Ra = sqrt(aSq_dSq + xSq + ySq + 2 * x * y * c)
    RaInv = 1 / Ra

    Ra_Rd_t1 = Ra + y + x * c
    Ra_Rd_t2 = Ra + x + y * c

    log_Ra_Rd_t1 = log(Ra_Rd_t1)
    xlog_Ra_Rd_t1 = x * log_Ra_Rd_t1

    log_Ra_Rd_t2 = log(Ra_Rd_t2)
    ylog_Ra_Rd_t2 = y * log_Ra_Rd_t2

    RaSq_R_t1_I = RaInv / Ra_Rd_t1
    xRaSq_R_t1_I = x * RaSq_R_t1_I
    xSqRaSq_R_t1_I = x * xRaSq_R_t1_I

    RaSq_R_t2_I = RaInv / Ra_Rd_t2
    yRaSq_R_t2_I = y * RaSq_R_t2_I
    ySqRaSq_R_t2_I = y * yRaSq_R_t2_I

    den = 1 / sqrt(omcSqI * aSq_dSq)

    integ1 = -2 * den * atan((1 + c) * (Ra + x + y) * den)

    c_1 = aSq_dSq * integ1
    c_5_6 = (c * Ra - c_1) * omcSqI

    integ2 = (c * log_Ra_Rd_t1 - log_Ra_Rd_t2) * omcSqI
    integ3 = (c * log_Ra_Rd_t2 - log_Ra_Rd_t1) * omcSqI
    integ4 = (c * c_1 - Ra) * omcSqI
    integ5 = ylog_Ra_Rd_t2 + c_5_6
    integ6 = xlog_Ra_Rd_t1 + c_5_6

    c_11_12 = integ1 - c * RaInv
    c_15_18 = c * xRaSq_R_t1_I - RaInv
    x_13_14 = x * c_15_18
    c_19 = c * yRaSq_R_t2_I - RaInv
    y_13_14 = y * c_19
    c_16 = log_Ra_Rd_t1 - (x - c * y) * RaInv - cSq * ySqRaSq_R_t2_I
    z_15_18 = y * c_16
    c_17_19 = log_Ra_Rd_t2 - (y - c * x) * RaInv - cSq * xSqRaSq_R_t1_I

    c15_18_19 = 2 * integ4

    integ7 = (integ1 - xRaSq_R_t1_I - yRaSq_R_t2_I) / (aSq_dSq)
    integ8 = (RaSq_R_t1_I - c * RaSq_R_t2_I) * omcSqI
    integ9 = (RaSq_R_t2_I - c * RaSq_R_t1_I) * omcSqI
    integ10 = (RaInv - c * (xRaSq_R_t1_I + yRaSq_R_t2_I + integ1)) * omcSqI
    integ11 = (xRaSq_R_t1_I + cSq * yRaSq_R_t2_I + c_11_12) * omcSqI
    integ12 = (yRaSq_R_t2_I + cSq * xRaSq_R_t1_I + c_11_12) * omcSqI
    integ13 = (integ3 - x_13_14 + c * (y_13_14 - integ2)) * omcSqI
    integ14 = (integ2 - y_13_14 + c * (x_13_14 - integ3)) * omcSqI
    integ15 = (integ5 - z_15_18 + c * (xSq * c_15_18 - c15_18_19)) * omcSqI
    integ16 = (xSqRaSq_R_t1_I + c * c_16 + 2 * integ2) * omcSqI
    integ17 = (ySqRaSq_R_t2_I + c * c_17_19 + 2 * integ3) * omcSqI
    integ18 = (c15_18_19 - xSq * c_15_18 + c * (z_15_18 - integ5)) * omcSqI
    integ19 = (c15_18_19 - ySq * c_19 + c * (x * c_17_19 - integ6)) * omcSqI

    return integ1,
    integ2,
    integ3,
    integ4,
    integ5,
    integ6,
    integ7,
    integ8,
    integ9,
    integ10,
    integ11,
    integ12,
    integ13,
    integ14,
    integ15,
    integ16,
    integ17,
    integ18,
    integ19
end

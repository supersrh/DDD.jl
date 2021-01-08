"""
```
calcPKForce(
    mesh::RegularCuboidMesh,
    dlnFEM::DislocationFEMCorrective,
    network::DislocationNetwork,
)
```
Calculate the Peach-Koehler force on segments.

``
f = (\\hat{\\mathbb{\\sigma}} \\cdot \\overrightarrow{b}) \\times \\overrightarrow{l}
``
"""
function calcPKForce(
    mesh::RegularCuboidMesh,
    dlnFEM::DislocationFEMCorrective,
    network::DislocationNetwork,
)
    # Unroll constants.
    numSeg = network.numNodeSegConnect[2]
    segIdx = network.segIdx
    bVec = network.bVec
    coord = network.coord
    elemT = eltype(network.bVec)

    idxBvec = @view segIdx[idx, 1]
    idxNode1 = @view segIdx[idx, 2]
    idxNode2 = @view segIdx[idx, 3]
    # Un normalised segment vectors. Use views for speed.
    bVec = @view bVec[:, idxBvec]
    tVec = @views coord[:, idxNode2] - coord[:, idxNode1]
    midNode = @views (coord[:, idxNode2] + coord[:, idxNode1]) / 2

    PKForce = zeros(elemT, 3, numSeg)      # Vector of PK force.

    # Loop over segments.
    for i in 1:numSeg
        x0 = SVector{3, elemT}(midNode[i, 1], midNode[i, 2], midNode[i, 3])
        b = SVector{3, elemT}(bVec[i, 1], bVec[i, 2], bVec[i, 3])
        t = SVector{3, elemT}(tVec[i, 1], tVec[i, 2], tVec[i, 3])
        σ_hat = calc_σ_hat(mesh, dlnFEM, x0)
        pkforce = (σ_hat * b) × t
        PKForce[1, i] = pkforce[1]
        PKForce[2, i] = pkforce[2]
        PKForce[3, i] = pkforce[3]
    end

    return PKForce
end

"""
```
calc_σ_hat(
    mesh::RegularCuboidMesh,
    dlnFEM::DislocationFEMCorrective,
    x0::AbstractArray{T, N} where {T, N},
)
```
Calculate the reaction from a dislocation.
"""
function calc_σ_hat(
    mesh::RegularCuboidMesh,
    dlnFEM::DislocationFEMCorrective,
    x0::AbstractVector{T} where {T},
)

    # Unroll structure.
    mx = mesh.numElem[1]        # num elem in x
    my = mesh.numElem[2]        # num elem in y
    mz = mesh.numElem[3]        # num elem in z
    w = 1 / mesh.sizeElem[1]    # 1 / width
    h = 1 / mesh.sizeElem[2]    # 1 / height
    d = 1 / mesh.sizeElem[3]    # 1 / depth
    sizeMesh = mesh.sizeMesh
    C = mesh.stiffTensor
    label = mesh.label
    coord = mesh.coord
    elemT = eltype(coord)

    uHat = dlnFEM.uHat

    x, y, z = x0

    # Find element index closest to the coordinate.
    i = maximum(ceil(x * w), 1)
    j = maximum(ceil(y * h), 1)
    k = maximum(ceil(z * d), 1)

    # Calculate index of the elements.
    idx = i + (k - 1) * mx + (j - 1) * mx * mz

    # Diametrically opposed points in a cubic element.
    n1 = label[idx, 1]
    n7 = label[idx, 7]

    # Find element midpoints.
    xc = 0.5 * (coord[1, n1] + coord[1, n7])
    yc = 0.5 * (coord[2, n1] + coord[2, n7])
    zc = 0.5 * (coord[3, n1] + coord[3, n7])

    # Setting up Jacobian.
    ds1dx = 2 * w   # 1/(0.5 * width)
    ds2dy = 2 * h
    ds3dz = 2 * d
    s1 = ds1dx * (x - xc) # (x - xc)/(0.5 * width)
    s2 = ds2dy * (y - yc)
    s3 = ds3dz * (z - zc)

    dNdS = shapeFunctionDeriv(LinearQuadrangle3D(), s1, s2, s3)
    dNdS[1, :] *= ds1dx
    dNdS[2, :] *= ds2dy
    dNdS[3, :] *= ds3dz

    numNodeElem = size(dNdS, 2)
    len = 3 * numNodeElem
    B = MMatrix{6, len, elemT}(zeros(6, len))
    U = MVector{len, elemT}(zeros(len))

    for i in 1:numNodeElem
        # Indices calculated once for performance.
        idx1 = 3 * i
        idx2 = 3 * (i - 1)
        # label[a, b] is the index of the node b, in FE element a.
        idx3 = label[i]
        # Constructing the Jacobian for node i.
        B[1, idx2 + 1] = dNdS[1, i]
        B[2, idx2 + 2] = dNdS[2, i]
        B[3, idx2 + 3] = dNdS[3, i]

        B[4, idx2 + 1] = B[2, idx2 + 2]
        B[4, idx2 + 2] = B[1, idx2 + 1]

        B[5, idx2 + 1] = B[3, idx1 + 0]
        B[5, idx1 + 0] = B[1, idx2 + 1]

        B[6, idx2 + 2] = B[3, idx1 + 0]
        B[6, idx1 + 0] = B[2, idx2 + 2]
        # Building uhat for the nodes of the finite element closest to the point of interest. From idx3, the finite element is the i2'th element and the the node we're looking at is the j'th node. The node index is idx3 = label[i2,j].
        U[1, i] = uHat[1, idx3]
        U[2, i] = uHat[2, idx3]
        U[3, i] = uHat[3, idx3]
    end

    # Isotropic stress tensor in vector form.
    # σ_vec[1] = σ_xx
    # σ_vec[2] = σ_yy
    # σ_vec[3] = σ_zz
    # σ_vec[4] = σ_xy = σ_yx
    # σ_vec[5] = σ_xz = σ_xz
    # σ_vec[6] = σ_yz = σ_zy

    # B*U transforms U from the nodes of the closest finite element with index i2=idx[i] to the point of interest [s1, s2, s3].

    σ_vec = C * B * U
    σ = SMatrix{3, 3, elemT}(
        σ_vec[1],
        σ_vec[4],
        σ_vec[5],
        σ_vec[4],
        σ_vec[2],
        σ_vec[6],
        σ_vec[5],
        σ_vec[6],
        σ_vec[3],
    )

    return σ
end

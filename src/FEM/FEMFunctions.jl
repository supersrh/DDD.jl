function shapeFunction(
    shape::LinearQuadrangle3D,
    x::Float64,
    y::Float64,
    z::Float64,
)

    # N[a, b] := shape function b for point a.
    N = zeros(8)

    N[1] = (1 - x) * (1 - y) * (1 - z)
    N[2] = (1 + x) * (1 - y) * (1 - z)
    N[3] = (1 + x) * (1 + y) * (1 - z)
    N[4] = (1 - x) * (1 + y) * (1 - z)
    N[5] = (1 - x) * (1 - y) * (1 + z)
    N[6] = (1 + x) * (1 - y) * (1 + z)
    N[7] = (1 + x) * (1 + y) * (1 + z)
    N[8] = (1 - x) * (1 + y) * (1 + z)

    N .*= 0.125

    return N
end

function shapeFunction(
    shape::LinearQuadrangle3D,
    x::AbstractVector{<:Float64},
    y::AbstractVector{<:Float64},
    z::AbstractVector{<:Float64},
)
    @assert length(x) == length(y) == length(z)
    # N[a, b] := shape function b for point a.
    N = zeros(length(x), 8)

    N[:, 1] = @. (1 - x) * (1 - y) * (1 - z)
    N[:, 2] = @. (1 + x) * (1 - y) * (1 - z)
    N[:, 3] = @. (1 + x) * (1 + y) * (1 - z)
    N[:, 4] = @. (1 - x) * (1 + y) * (1 - z)
    N[:, 5] = @. (1 - x) * (1 - y) * (1 + z)
    N[:, 6] = @. (1 + x) * (1 - y) * (1 + z)
    N[:, 7] = @. (1 + x) * (1 + y) * (1 + z)
    N[:, 8] = @. (1 - x) * (1 + y) * (1 + z)

    N .*= 0.125

    return N
end

function shapeFunctionDeriv(
    shape::LinearQuadrangle3D,
    x::Float64,
    y::Float64,
    z::Float64,
)
    # dNdS[a, b, c] := c derivative of shape function b for point a.
    # dNdS[a, b] = dN[a, b] / dc
    dNdS = zeros(8, 3)

    dNdS[1, 1] = -(1 - y) * (1 - z)
    dNdS[2, 1] = (1 - y) * (1 - z)
    dNdS[3, 1] = (1 + y) * (1 - z)
    dNdS[4, 1] = -(1 + y) * (1 - z)
    dNdS[5, 1] = -(1 - y) * (1 + z)
    dNdS[6, 1] = (1 - y) * (1 + z)
    dNdS[7, 1] = (1 + y) * (1 + z)
    dNdS[8, 1] = -(1 + y) * (1 + z)

    dNdS[1, 2] = -(1 - x) * (1 - z)
    dNdS[2, 2] = -(1 + x) * (1 - z)
    dNdS[3, 2] = (1 + x) * (1 - z)
    dNdS[4, 2] = (1 - x) * (1 - z)
    dNdS[5, 2] = -(1 - x) * (1 + z)
    dNdS[6, 2] = -(1 + x) * (1 + z)
    dNdS[7, 2] = (1 + x) * (1 + z)
    dNdS[8, 2] = (1 - x) * (1 + z)

    dNdS[1, 3] = -(1 - x) * (1 - y)
    dNdS[2, 3] = -(1 + x) * (1 - y)
    dNdS[3, 3] = -(1 + x) * (1 + y)
    dNdS[4, 3] = -(1 - x) * (1 + y)
    dNdS[5, 3] = (1 - x) * (1 - y)
    dNdS[6, 3] = (1 + x) * (1 - y)
    dNdS[7, 3] = (1 + x) * (1 + y)
    dNdS[8, 3] = (1 - x) * (1 + y)

    dNdS .*= 0.125

    return dNdS
end

function shapeFunctionDeriv(
    shape::LinearQuadrangle3D,
    x::AbstractVector{<:Float64},
    y::AbstractVector{<:Float64},
    z::AbstractVector{<:Float64},
)
    @assert length(x) == length(y) == length(z)
    # dNdS[a, b, c] := c derivative of shape function b for point a.
    # dNdS[a, b] = dN[a, b] / dc
    dNdS = zeros(length(x), 8, 3)

    dNdS[:, 1, 1] = @. -(1 - y) * (1 - z)
    dNdS[:, 2, 1] = @. (1 - y) * (1 - z)
    dNdS[:, 3, 1] = @. (1 + y) * (1 - z)
    dNdS[:, 4, 1] = @. -(1 + y) * (1 - z)
    dNdS[:, 5, 1] = @. -(1 - y) * (1 + z)
    dNdS[:, 6, 1] = @. (1 - y) * (1 + z)
    dNdS[:, 7, 1] = @. (1 + y) * (1 + z)
    dNdS[:, 8, 1] = @. -(1 + y) * (1 + z)

    dNdS[:, 1, 2] = @. -(1 - x) * (1 - z)
    dNdS[:, 2, 2] = @. -(1 + x) * (1 - z)
    dNdS[:, 3, 2] = @. (1 + x) * (1 - z)
    dNdS[:, 4, 2] = @. (1 - x) * (1 - z)
    dNdS[:, 5, 2] = @. -(1 - x) * (1 + z)
    dNdS[:, 6, 2] = @. -(1 + x) * (1 + z)
    dNdS[:, 7, 2] = @. (1 + x) * (1 + z)
    dNdS[:, 8, 2] = @. (1 - x) * (1 + z)

    dNdS[:, 1, 3] = @. -(1 - x) * (1 - y)
    dNdS[:, 2, 3] = @. -(1 + x) * (1 - y)
    dNdS[:, 3, 3] = @. -(1 + x) * (1 + y)
    dNdS[:, 4, 3] = @. -(1 - x) * (1 + y)
    dNdS[:, 5, 3] = @. (1 - x) * (1 - y)
    dNdS[:, 6, 3] = @. (1 + x) * (1 - y)
    dNdS[:, 7, 3] = @. (1 + x) * (1 + y)
    dNdS[:, 8, 3] = @. (1 - x) * (1 + y)

    dNdS .*= 0.125

    return dNdS
end

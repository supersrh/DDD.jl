using DDD
using Test

inFilename = "C:/Users/Daniel Celis Garza/.julia/dev/DDD/inputs/simParams/sample"
outFilename = "C:/Users/Daniel Celis Garza/.julia/dev/DDD/outputs/simParams/sample"
dlnParams, matParams, intParams = loadParams(inFilename)
saveParams(dlnParams, matParams, intParams, outFilename; delim = ',')
dlnParams2, matParams2, intParams2 = loadParams(outFilename)

import DDD: compStruct
@testset "DDD.jl" begin
    @test compStruct(dlnParams, dlnParams2)
    @test compStruct(matParams, matParams2)
    @test compStruct(intParams, intParams2)
end

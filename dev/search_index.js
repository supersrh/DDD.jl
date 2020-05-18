var documenterSearchIndex = {"docs":
[{"location":"types/#Types-1","page":"Types","title":"Types","text":"","category":"section"},{"location":"types/#Material-1","page":"Types","title":"Material","text":"","category":"section"},{"location":"types/#","page":"Types","title":"Types","text":"AbstractCrystalStruct\n\nMaterialP","category":"page"},{"location":"types/#DDD.AbstractCrystalStruct","page":"Types","title":"DDD.AbstractCrystalStruct","text":"abstract type AbstractCrystalStruct end\nstruct BCC <: AbstractCrystalStruct end\nstruct FCC <: AbstractCrystalStruct end\nstruct HCP <: AbstractCrystalStruct end\n\nCrystal structure types.\n\n\n\n\n\n","category":"type"},{"location":"types/#DDD.MaterialP","page":"Types","title":"DDD.MaterialP","text":"struct MaterialP{T1, T2}\n    μ::T1\n    μMag::T1\n    ν::T1\n    E::T1\n    crystalStruct::T2\nend\n\n\n\n\n\n","category":"type"},{"location":"types/#Integration-1","page":"Types","title":"Integration","text":"","category":"section"},{"location":"types/#","page":"Types","title":"Types","text":"AbstractIntegrator\n\nIntegrationP","category":"page"},{"location":"types/#DDD.AbstractIntegrator","page":"Types","title":"DDD.AbstractIntegrator","text":"abstract type AbstractIntegrator end\nstruct CustomTrapezoid <:AbstractIntegrator end\n\nIntegrator types.\n\n\n\n\n\n","category":"type"},{"location":"types/#DDD.IntegrationP","page":"Types","title":"DDD.IntegrationP","text":"mutable struct IntegrationP{T1, T2, T3}\n    dt::T1\n    tmin::T1\n    tmax::T1\n    method::T2\n    abstol::T1\n    reltol::T1\n    time::T1\n    step::T3\nend\n\nThis structure contains the integration parameters for the simulation.\n\n\n\n\n\n","category":"type"},{"location":"types/#FEM-1","page":"Types","title":"FEM","text":"","category":"section"},{"location":"types/#","page":"Types","title":"Types","text":"AbstractMesh\n\nAbstractShapeFunction\n\nRegularCuboidMesh","category":"page"},{"location":"types/#DDD.AbstractMesh","page":"Types","title":"DDD.AbstractMesh","text":"abstract type AbstractMesh end\n\nAbstract mesh type.\n\n\n\n\n\n","category":"type"},{"location":"types/#DDD.AbstractShapeFunction","page":"Types","title":"DDD.AbstractShapeFunction","text":"abstract type AbstractShapeFunction end\nabstract type AbstractShapeFunction3D <: AbstractShapeFunction end\nabstract type AbstractShapeFunction2D <: AbstractShapeFunction end\nstruct LinearQuadrangle3D <:AbstractShapeFunction3D end\nstruct LinearQuadrangle2D <:AbstractShapeFunction2D end\n\nShape function types.\n\n\n\n\n\n","category":"type"},{"location":"types/#DDD.RegularCuboidMesh","page":"Types","title":"DDD.RegularCuboidMesh","text":"struct RegularCuboidMesh{\n    T1 <: AbstractArray{T3, N} where {T3, N},\n    T2 <: AbstractArray{T4, N} where {T4, N},\n}\n    label::T1\n    sizeElem::T2\n    sizeMesh::T2\n    stiffTensor::T2\n    coord::T2\n    vertices::T2\nend\n\nCuboid mesh structure.\n\n\n\n\n\n","category":"type"},{"location":"types/#Dislocation-1","page":"Types","title":"Dislocation","text":"","category":"section"},{"location":"types/#","page":"Types","title":"Types","text":"nodeType\n\nAbstractDlnSeg\n\nAbstractDlnStr\n\nAbstractDistribution\n\nAbstractMobility\n\nSlipSystem","category":"page"},{"location":"types/#DDD.nodeType","page":"Types","title":"DDD.nodeType","text":"Dislocation nodes have labels that change how they are treated by the simulation. There are only certain types of nodes so these labels may only take on predefined values. Adding new nodes requires adding new entries to the enumerated type.\n\n@enum nodeType begin\n    none = 0  # Undefined node, value at initialisation.\n    intMob = 1  # Internal mobile node.\n    intFix = 2  # Internal fixed node.\n    srfMob = 3  # Mobile surface node.\n    srfFix = 4  # Fixed surface node.\n    ext = 5     # External node.\nend\n\n\n\n\n\n","category":"type"},{"location":"types/#DDD.AbstractDlnStr","page":"Types","title":"DDD.AbstractDlnStr","text":"Dislocation structures have different classifications. Prismatic loops are made up only of edge segments with the same slip system; shear loops are made up of a mixture of segment types with the same slip system; jogs and kinks are steps not contained in the slip plane.\n\nabstract type AbstractDlnStr end\nstruct loopDln <: AbstractDlnStr end    # Unclassified loop.\nstruct loopPrism <: AbstractDlnStr end  # Prismatic loop.\nstruct loopShear <: AbstractDlnStr end  # Shear loop.\nstruct loopJog <: AbstractDlnStr end    # Jog.\nstruct loopKink <: AbstractDlnStr end   # Kink.\n\n\n\n\n\n","category":"type"},{"location":"types/#DDD.AbstractDistribution","page":"Types","title":"DDD.AbstractDistribution","text":"abstract type AbstractDistribution end\nstruct Zeros <: AbstractDistribution end\nstruct Rand <: AbstractDistribution end\nstruct Randn <: AbstractDistribution end\nstruct Regular <: AbstractDistribution end\n\nDistributions for dislocation sources.\n\n\n\n\n\n","category":"type"},{"location":"types/#DDD.SlipSystem","page":"Types","title":"DDD.SlipSystem","text":"struct SlipSystem{T1 <: AbstractCrystalStruct, T2 <: AbstractArray{T, N} where {T, N}}\n    crystalStruct::T1\n    slipPlane::T2\n    bVec::T2\nend\n\nSlip systems.\n\n\n\n\n\n","category":"type"},{"location":"types/#Dislocation-FEM-1","page":"Types","title":"Dislocation-FEM","text":"","category":"section"},{"location":"types/#","page":"Types","title":"Types","text":"DislocationFEMCorrective","category":"page"},{"location":"types/#DDD.DislocationFEMCorrective","page":"Types","title":"DDD.DislocationFEMCorrective","text":"mutable struct DislocationFEMCorrective{T1 <: AbstractArray{T2, N} where {T2, N}}\n    uHat::T1 # U_hat\n    fHat::T1 # F_hat\nend\n\nCorrective stress and force.\n\n\n\n\n\n","category":"type"},{"location":"types/#Composite-Types-1","page":"Types","title":"Composite Types","text":"","category":"section"},{"location":"functions/#Functions-1","page":"Functions","title":"Functions","text":"","category":"section"},{"location":"functions/#Dislocation-1","page":"Functions","title":"Dislocation","text":"","category":"section"},{"location":"functions/#","page":"Functions","title":"Functions","text":"","category":"page"},{"location":"functions/#FEM-1","page":"Functions","title":"FEM","text":"","category":"section"},{"location":"functions/#","page":"Functions","title":"Functions","text":"shapeFunction\n\nshapeFunctionDeriv","category":"page"},{"location":"functions/#DDD.shapeFunction","page":"Functions","title":"DDD.shapeFunction","text":"shapeFunction(shape<:AbstractShapeFunction, x, y, z)\n\nReturns the shape functions of type typeof(shape) <: AbstractShapeFunction. If x,y,z are floats returns a vector of length N, different shape functons have different numbers of nodes. If given vectors, returns an array of size (N, length(x)).\n\nnote: Note\nAll coordinate vectors must be of equal length.\n\nshapeFunctionDeriv are the 1st order derivatives of the shape functions.\n\n\n\n\n\n","category":"function"},{"location":"functions/#DDD.shapeFunctionDeriv","page":"Functions","title":"DDD.shapeFunctionDeriv","text":"shapeFunctionDeriv(shape<:AbstractShapeFunction, x, y, z)\n\nReturns the first order derivative of the shape functions, shapeFunction, of type typeof(shape) <: AbstractShapeFunction. If x,y,z are floats returns a 2D array of size (N, 3). If given vectors, returns a 3D array of size (N, 3, length(x)).\n\nnote: Note\nAll coordinate vectors must be of equal length.\n\n\n\n\n\n","category":"function"},{"location":"functions/#Dislocation-FEM-1","page":"Functions","title":"Dislocation FEM","text":"","category":"section"},{"location":"functions/#","page":"Functions","title":"Functions","text":"calcPKForce\n\ncalc_σ_hat","category":"page"},{"location":"functions/#DDD.calcPKForce","page":"Functions","title":"DDD.calcPKForce","text":"calcPKForce(\n    mesh::RegularCuboidMesh,\n    dlnFEM::DislocationFEMCorrective,\n    network::DislocationNetwork,\n)\n\nCalculate the Peach-Koehler force on segments.\n\nf = (hatmathbbsigma cdot overrightarrowb) times overrightarrowl\n\n\n\n\n\n","category":"function"},{"location":"functions/#Miscelaneous-1","page":"Functions","title":"Miscelaneous","text":"","category":"section"},{"location":"functions/#","page":"Functions","title":"Functions","text":"makeInstanceDict\n\ntranslateEnum\n\nsubTypeTree\n\nmakeTypeDict\n\ninclusiveComparison\n\ncompStruct\n\nintAngle\n\nextAngle\n\nrot3D\n\ndimDot\n\ndimNorm","category":"page"},{"location":"functions/#DDD.makeInstanceDict","page":"Functions","title":"DDD.makeInstanceDict","text":"makeInstanceDict(valType::DataType)\n\nMake a dictionary of enumerated variable instances. Helps in translating JSON files.\n\n\n\n\n\n","category":"function"},{"location":"functions/#DDD.translateEnum","page":"Functions","title":"DDD.translateEnum","text":"translateEnum(\n    valType::DataType,\n    dict::Dict{T1, T2},\n    key::T3,\n) where {T1, T2, T3}\n\nTranslates the string name of enumerated types to the actual Julia type.\n\n\n\n\n\n","category":"function"},{"location":"functions/#DDD.subTypeTree","page":"Functions","title":"DDD.subTypeTree","text":"subTypeTree(t; dict = Dict(), level = 1, cutoff = 0)\n\nCreate subtype dictionary. . Adapted from https://github.com/JuliaLang/julia/issues/24741\n\n\n\n\n\n","category":"function"},{"location":"functions/#DDD.makeTypeDict","page":"Functions","title":"DDD.makeTypeDict","text":"makeTypeDict(valType::DataType)\n\nInputs contain strings that correspond to DDD data types. This function atuomatically creates a dictionary for all concrete subtypes of a given valType.\n\nExamples\n\njulia> abstract type MyAbstractType end\njulia> struct MyStruct1 <: MyAbstractType end\njulia> struct MyStruct2 <: MyAbstractType end\njulia> makeTypeDict(MyAbstractType)\nDict{String,Any} with 4 entries:\n  \"DDD.MyStruct1()\" => MyStruct1()\n  \"DDD.MyStruct2()\" => MyStruct2()\n  \"MyStruct1()\"     => MyStruct1()\n  \"MyStruct2()\"     => MyStruct2()\n\n\n\n\n\n","category":"function"},{"location":"functions/#DDD.inclusiveComparison","page":"Functions","title":"DDD.inclusiveComparison","text":"inclusiveComparison(data, args...)::Bool\n\nCompare data to a tuple, return true if it is equal to any arg, false if it is not equal to any.\n\nExamples\n\njulia> inclusiveComparison(\"f\", 1,4,5,\"f\")\ntrue\njulia> inclusiveComparison(23.246, 1.5, 4, 5, \"f\")\nfalse\n\n\n\n\n\n","category":"function"},{"location":"functions/#DDD.compStruct","page":"Functions","title":"DDD.compStruct","text":"compStruct(arg1, arg2; verbose::Bool = false)\n\nFunction that compares values of the fields of two variables arg1 and arg2 with the same structure. If verbose = true, it will print which fields are different from each other.\n\nExamples\n\njulia> struct MyStruct1; x; end\njulia> test1 = MyStruct1(1)\nMyStruct1(1)\njulia> test2 = MyStruct1(5)\nMyStruct1(5)\njulia> compStruct(test1, test2; verbose = true)\nStructures differ in field: x.\nfalse\njulia> compStruct(1, 1; verbose = true)\ntrue\njulia> compStruct(1, [1]; verbose = true)\nfalse\n\n\n\n\n\n","category":"function"},{"location":"functions/#DDD.intAngle","page":"Functions","title":"DDD.intAngle","text":"intAngle(n::Int)\n\nCalculates the interior angle of a regular polygon with n sides.\n\n\n\n\n\n","category":"function"},{"location":"functions/#DDD.extAngle","page":"Functions","title":"DDD.extAngle","text":"extAngle(n::Int)\n\nCalculates the exterior angle of a regular polygon with n sides.\n\n\n\n\n\n","category":"function"},{"location":"functions/#DDD.rot3D","page":"Functions","title":"DDD.rot3D","text":"rot3D(\n    xyz::AbstractVector{T1},\n    uvw::AbstractVector{T2},\n    abc::AbstractVector{T3},\n    θ::T4,\n) where {T1, T2, T3, T4}\n\nRotate point xyz about the line with direction vector uvw that crosses the point abc by the angle θ. Further details found here.\n\nExamples\n\njulia> rot3D([1;1;1],[1;0;0],[0;0;0],π/2)\n3-element Array{Float64,1}:\n  1.0\n -0.9999999999999999\n  1.0\njulia> rot3D([1;1;1],[1;0;0],[0;0;0],-π/2)\n3-element Array{Float64,1}:\n1.0\n1.0\n-0.9999999999999999\njulia> rot3D([1;1;1],[1;0;0],[0;0;0],π)\n3-element Array{Float64,1}:\n  1.0\n -1.0000000000000002\n -0.9999999999999999\n\n\n\n\n\n","category":"function"},{"location":"functions/#DDD.dimDot","page":"Functions","title":"DDD.dimDot","text":"dimDot(\n    x::AbstractArray{T1, N},\n    y::AbstractArray{T2, N};\n    dim::Int = 2,\n) where {T1, T2, N}\n\nPerform dot product along dimension dim of an array, returns a vector of dot products.\n\n\n\n\n\n","category":"function"},{"location":"functions/#DDD.dimNorm","page":"Functions","title":"DDD.dimNorm","text":"dimNorm(x::AbstractArray{T, N}; dim::Int = 2) where {T, N}\n\nCalculate norms along dimension dim of an array, returns a vector of norms.\n\n\n\n\n\n","category":"function"},{"location":"theory/#Discrete-Dislocation-Dynamics-1","page":"Theory","title":"Discrete Dislocation Dynamics","text":"","category":"section"},{"location":"postProcessing/#Post-Processing-1","page":"Post Processing","title":"Post Processing","text":"","category":"section"},{"location":"postProcessing/#","page":"Post Processing","title":"Post Processing","text":"plotNodes\n\nplotNodes!","category":"page"},{"location":"postProcessing/#DDD.plotNodes","page":"Post Processing","title":"DDD.plotNodes","text":"plotNodes(obj::Union{DislocationLoop, DislocationNetwork}, args...; kw...)\n\nPlots dislocation network as nodes connected by segments. Returns a new figure. See plotNodes! for mutating version.\n\n\n\n\n\n","category":"function"},{"location":"postProcessing/#DDD.plotNodes!","page":"Post Processing","title":"DDD.plotNodes!","text":"plotNodes!(fig, obj::Union{DislocationLoop, DislocationNetwork}, args...; kw...)\n\nUpdates figure to plot dislocation network as nodes connected by segments. See plotNodes for non-mutating version.\n\n\n\n\n\n","category":"function"},{"location":"idx/#Index-1","page":"Index","title":"Index","text":"","category":"section"},{"location":"idx/#","page":"Index","title":"Index","text":"","category":"page"},{"location":"#DDD.jl-Documentation-1","page":"Home","title":"DDD.jl Documentation","text":"","category":"section"},{"location":"io/#IO-1","page":"IO","title":"IO","text":"","category":"section"},{"location":"io/#Input-1","page":"IO","title":"Input","text":"","category":"section"},{"location":"io/#","page":"IO","title":"IO","text":"load(filename::AbstractString)\n\nloadDislocationLoop(\n    dict::Dict{T1, T2} where {T1, T2},\n    slipSystem::SlipSystem,\n)\n\nloadMaterialP(dict::Dict{T1, T2}) where {T1, T2}\n\nloadIntegrationP(dict::Dict{T1, T2}) where {T1, T2}\n\nloadSlipSystem(dict::Dict{T1, T2}) where {T1, T2}\n\nloadDislocationP(dict::Dict{T1, T2}) where {T1, T2}\n\nloadParams(\n    fileDislocationP::AbstractString,\n    fileMaterialP::AbstractString,\n    fileIntegrationP::AbstractString,\n    fileSlipSystem::AbstractString,\n    fileDislocationLoop::AbstractString,\n)\n\nloadNetwork(fileDislocationNetwork::AbstractString)","category":"page"},{"location":"io/#DDD.load-Tuple{AbstractString}","page":"IO","title":"DDD.load","text":"load(filename::AbstractString)\n\nWrapper for JSON.parsefile(filename).\n\n\n\n\n\n","category":"method"},{"location":"io/#DDD.loadDislocationLoop-Tuple{Dict{T1,T2} where T2 where T1,SlipSystem}","page":"IO","title":"DDD.loadDislocationLoop","text":"function loadDislocationLoop(\n    dict::Dict{T1, T2} where {T1, T2},\n    slipSystem::SlipSystem,\n)\n\nLoads initial dislocation structure out of a dictionary loaded from a JSON file. Returns a variable of type DislocationLoop.\n\n\n\n\n\n","category":"method"},{"location":"io/#DDD.loadMaterialP-Union{Tuple{Dict{T1,T2}}, Tuple{T2}, Tuple{T1}} where T2 where T1","page":"IO","title":"DDD.loadMaterialP","text":"loadMaterialP(dict::Dict{T1, T2}) where {T1, T2}\n\nLoads material parameters out of a dictionary loaded from a JSON file. Returns a variable of type MaterialP.\n\n\n\n\n\n","category":"method"},{"location":"io/#DDD.loadIntegrationP-Union{Tuple{Dict{T1,T2}}, Tuple{T2}, Tuple{T1}} where T2 where T1","page":"IO","title":"DDD.loadIntegrationP","text":"loadIntegrationP(dict::Dict{T1, T2}) where {T1, T2}\n\nLoads integration parameters out of a dictionary loaded from a JSON file. Returns a variable of type IntegrationP.\n\n\n\n\n\n","category":"method"},{"location":"io/#DDD.loadSlipSystem-Union{Tuple{Dict{T1,T2}}, Tuple{T2}, Tuple{T1}} where T2 where T1","page":"IO","title":"DDD.loadSlipSystem","text":"loadSlipSystem(dict::Dict{T1, T2}) where {T1, T2}\n\nLoads slip systems out of a dictionary loaded from a JSON file. Returns a variable of type SlipSystem.\n\n\n\n\n\n","category":"method"},{"location":"io/#DDD.loadDislocationP-Union{Tuple{Dict{T1,T2}}, Tuple{T2}, Tuple{T1}} where T2 where T1","page":"IO","title":"DDD.loadDislocationP","text":"loadDislocationP(dict::Dict{T1, T2}) where {T1, T2}\n\nLoads dislocation parameters out of a dictionary loaded from a JSON file. Returns a variable of type DislocationP.\n\n\n\n\n\n","category":"method"},{"location":"io/#DDD.loadParams-NTuple{5,AbstractString}","page":"IO","title":"DDD.loadParams","text":"loadParams(\n    fileDislocationP::AbstractString,\n    fileMaterialP::AbstractString,\n    fileIntegrationP::AbstractString,\n    fileSlipSystem::AbstractString,\n    fileDislocationLoop::AbstractString,\n)\n\nLoads simulation parameters out of a dictionary loaded from a JSON file. Returns a tuple of variable types (DislocationP, MaterialP, IntegrationP, SlipSystem, DislocationLoop) or vectors of those types.\n\n\n\n\n\n","category":"method"},{"location":"io/#DDD.loadNetwork-Tuple{AbstractString}","page":"IO","title":"DDD.loadNetwork","text":"loadNetwork(fileDislocationNetwork::AbstractString)\n\nLoads a dislocation network from a JSON file. Returns a DislocationNetwork.\n\n\n\n\n\n","category":"method"},{"location":"io/#Output-1","page":"IO","title":"Output","text":"","category":"section"},{"location":"io/#","page":"IO","title":"IO","text":"save(filename::AbstractString, args...; mode::AbstractString = \"w\")","category":"page"},{"location":"io/#DDD.save-Tuple{AbstractString,Vararg{Any,N} where N}","page":"IO","title":"DDD.save","text":"save(filename::AbstractString, args...; mode::AbstractString = \"w\")\n\nWrapper for JSON.print to a file, args are the variables or structures you want to save.\n\n\n\n\n\n","category":"method"},{"location":"motivation/#Motivation-1","page":"Motivation","title":"Motivation","text":"","category":"section"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"DDD.jl was created with the aim to make 3D discrete dislocation dynamics research more tractable, transparent and productive.","category":"page"},{"location":"motivation/#Objectives-1","page":"Motivation","title":"Objectives","text":"","category":"section"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"Dislocation dynamics is notoriously impenetrable due to the wide range of techniques and historically disparate sciences involved in their study. Lowering the barrier to entry and simplifying the workflows of experimental, theoretical and computational researchers will simplify the development of the field. Specifically, our objectives are to develop a codebase that meets the following requirements:","category":"page"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"ease of use\nsimulations are easy to set up\ninteractivity\nplotting and post-processing\ndata analysis\nautomatic error checking\nstop and restart capabilities\nease of development and maintenance\nreadable code\nmetaprogramming\nmacros (compile time execution)\ngenerated functions (custom functions generated by the code itself)\nproblem logging\nclear warnings, errors and debug information\neasy to add new validations\nhigh level abstractions\narray and matrix operations\nunicode support\ncode introspection\ninteractive debugger\nprofiling and benchmarking\nidentify bottlenecks, type instabilities before runtime\nminimal rewriting\nmodular\ngeneric functions\nself-containment\neasily parallelisable\nlocal parallelisation\ndistributed parallelisation\nGPU parallelisation\nwell documented\neasily add documentation\nnative LaTeX support\nautomatically generated\nwell developed testing capabilities\neasily add tests\neasily interpreted tests\ntest everything even logging events such as warnings and errors\nperformant\nuse as few languages as possible\nCUDA may be needed for specialised parallelisation but should not be a requirement\nself-contained\nno external dependencies\nopen-source, shareable, portable\npublically hosted\nstandardised IO (input-output)\nplug and play","category":"page"},{"location":"motivation/#Possible-Languages-for-Implementation-1","page":"Motivation","title":"Possible Languages for Implementation","text":"","category":"section"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"Historically, two languages that have reigned supreme in the field of scientific computing Fortran and C, however with the advent of object-oriented programming, and interpreted languages that list has expanded. Here we offer some likely candidates to build our code. Some of which have been used in the past to create dislocation dynamics codes of different ilks.","category":"page"},{"location":"motivation/#Fortran-(f90)-1","page":"Motivation","title":"Fortran (f90+)","text":"","category":"section"},{"location":"motivation/#Advantages-1","page":"Motivation","title":"Advantages","text":"","category":"section"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"It is performant, readable, modular, open-source, highly abstracted, natively parallelisable (compiler dependent), and safe through the use of intent() inside functions. Documentation for the language itself is available on the f90 standard practices site and there is a sizeable knowledge base found in StackExchange and the Intel Fortran forums.","category":"page"},{"location":"motivation/#Disadvantages-1","page":"Motivation","title":"Disadvantages","text":"","category":"section"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"It lacks interactivity, metaprogramming (aside from preprocessor macros), and a proper internal standard library. BLAS and LAPACK are as close to a standard library as Fortran gets, but they have to be installed and linked to at compilation time. Furthermore, different compilers break portability, in some cases what is performant code in one compiler is bad code in another. It also has nothing in the way of native testing and documenting, but there are Python tools to do so.","category":"page"},{"location":"motivation/#C-1","page":"Motivation","title":"C","text":"","category":"section"},{"location":"motivation/#Advantages-2","page":"Motivation","title":"Advantages","text":"","category":"section"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"It is performant, small, modular, open-source and compilers are highly standardised. There is no shortage of documentation for C all accross the internet.","category":"page"},{"location":"motivation/#Disadvantages-2","page":"Motivation","title":"Disadvantages","text":"","category":"section"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"On top of lacking what Fortran also lacks, it has the added wrinkle of pointer arithmetic. Which is famously the cause of most C bugs. The best case scenario for such bugs lead to obvious problems like segmentation faults and NaN values. However, more insidious and opaque bugs are not uncommon in complex code, examples include pointer dereferencing, function side effects and memory leaks. Such bugs are hard to track, reproduce and at times catastrophic. Some very well-known bugs and exploits in commercial software such as Windows have been thanks to memory leaks and pointer dereferencing, often going undiscovered for years and through multiple versions. C also doesn't offer anything in the way of abstraction other than structures.","category":"page"},{"location":"motivation/#C-2","page":"Motivation","title":"C++","text":"","category":"section"},{"location":"motivation/#Advantages-3","page":"Motivation","title":"Advantages","text":"","category":"section"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"It has an extensive standard library of optimised algorithms and data structures, all of which are excellently documented. It is open-source and its compilers are also highly standardised (though not as much as C). It also offers serious metaprogramming capabilities, and can be made to be very performant if used correctly, sometimes more so than a naïve C implementation. There are extensive knowledge bases of C++ but the problem is often in deciphering how one may adapt the posted solution to their specific situation.","category":"page"},{"location":"motivation/#Disadvantages-3","page":"Motivation","title":"Disadvantages","text":"","category":"section"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"It is extremely is verbose, very difficult to learn and use correctly, opaque and unintuitive (new v.s. malloc(), del vs free(), namespaces). It mitigates some of the problems of C at the cost of runtime performance and added program complexity. It also tends to make debugging user defined code more difficult because one has to trawl through verbose, complicated syntax. It also requires external libraries to be installed and linked to during compilation.","category":"page"},{"location":"motivation/#Python-1","page":"Motivation","title":"Python","text":"","category":"section"},{"location":"motivation/#Advantages-4","page":"Motivation","title":"Advantages","text":"","category":"section"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"The golden child of interpreted languages is readable, easy to use, open-source, standardised, portable and interactive. It also has an even more extensive standard library than C++. Its vibrant package ecosystem ensures there are packages for every need and frees the user from worrying about external dependencies because they are taken care of by the package installer either automatically or by printing the command required to install the dependency. It has native documentation, testing and benchmarking capabilities. The language has an extremely high level of abstraction and is rapidly evolving, improving and expanding. Package documentation tends to be the gold standard for documentation across all languages by virtue of the sheer number of users and contributors. There is also an extensive knowledge base throughout the internet where solutions to problems have most likely already been posted about and found, if not, one can make a post and have their question answered rather quickly.","category":"page"},{"location":"motivation/#Disadvantages-4","page":"Motivation","title":"Disadvantages","text":"","category":"section"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"It is not performant without serious modification like using Cython or by standard-breaking practices to use the JIT (just in time compiler) offered by numba. Packages such as numpy and scipy help in this regard, but more often than not, the number crunching is done via calls to C, CUDA and Fortran routines through wrappers or direct external calls. Python can also get somewhat verbose, particularly when using a few packages where namespaces must be distinguished by aliases. Standalone executables are much larger than they would be in other languages.","category":"page"},{"location":"motivation/#Matlab-1","page":"Motivation","title":"Matlab","text":"","category":"section"},{"location":"motivation/#Advantages-5","page":"Motivation","title":"Advantages","text":"","category":"section"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"Is readable, easy to use, standardised and interactive. It has native testing, documentation and benchmarking capabilities. The documentation for in-built functions is excellent. It offers limited object oriented capabilities, usually more than enough.","category":"page"},{"location":"motivation/#Disadvantages-5","page":"Motivation","title":"Disadvantages","text":"","category":"section"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"It is closed-source and proprietary. Worse, many of the toolboxes and specialised features are not standard and require additional purchase. Furthermore, the knowledge base for specific questions is limited to the Mathworks forums where only people with Mathworks accounts may post. Increasingly, Matlab offers less and less in comparison to Python. Pretty much all of the performance issues are shared by both languages, but Python is free, open-source and has a massive community developing packages and adding functionality.","category":"page"},{"location":"motivation/#Julia-1","page":"Motivation","title":"Julia","text":"","category":"section"},{"location":"motivation/#Advantages-6","page":"Motivation","title":"Advantages","text":"","category":"section"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"Every advantage that Python offers is also offered by Julia, from the standard library to benchmarking and testing. Its package ecosystem and user base is nowhere near as large as Python's, but it offers the same functionality.","category":"page"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"Unlike any of the other languages we mentioned, Julia is a JIT (just in time) compiled language, just like Python when using numba. So it offers C and Fortran-like performance after a function has been executed once. It offers the same level of abstraction as Python and Matlab while keeping similar or even equivalent[^1 In most cases, the abstractions have a cost-benefit associated with using them, using introspection tools is recommended if performance is critical. Sometimes they outperform less abstracted implementations, but others a non-abstracted implementation is better.] performance to Fortran and C.","category":"page"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"One of the advantages of object-oriented code is reusability and expandability. Function dispatch in object-oriented languages depends on the function's class. However, Julia's multiple dispatch, type system, and JIT compilation takes code reusability to another level by letting functions specialise depending on the types of their arguments. This means that one can expand functions defined anywhere in the code by declaring them for new types. This means developers can write generic functions that can be expanded by users as they see fit. A concrete example we use in DDD.jl is in constructing dislocation loops. Where new types of loops or even special dislocation structures don't need their own data structure, one can simply declare a new constructor for a new type of loop and it will be called using the same user-interface.","category":"page"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"Furthermore, Julia can be used as both, a statically typed or dynamically typed language. If one wants performance, one gets performance by annotating types[^2 Types do not have to be known by the user before runtime, they can be given parametrically and the compiler will use the argument's type during runtime to compile a specialised function. This lets programs be generically typed without sacrificing performance or adding verbosity.] and writing well-defined code. If one wants to use Julia interactively like Python or Matlab, that works too. And the compiler will do its best to ensure the code is performant.","category":"page"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"Another aspect that Julia offers that none of the others do is the ability to look at the different stages of compilation. This lets developers and users identify areas where the code might suffer a runtime bottleneck before even running it. There are also extensive profiling, debugging and benchmarking tools that provide timing and memory allocation information. Out of the languages mentioned, Julia is the easiest to write performant code in.","category":"page"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"If this weren't enough, there is also native support for CPU and GPU parallelisation both local and distributed, as well as the ability to call external languages with a single interface. Its metaprogramming capabilities are on par with C++ but much more concise and less impactful on compilation time.","category":"page"},{"location":"motivation/#Disadvantages-6","page":"Motivation","title":"Disadvantages","text":"","category":"section"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"Multiple dispatch can be abused by new users and may negatively impact performance. Precompilation time for packages and the \"time to first plot\" can be relatively long.","category":"page"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"It is a new language, things are changing rapidly and backwards compatibility may not always be guaranteed. There are also features that are experimental and subject to change, deprecation and removal. For example, 1.4 CPU parallelisation is experimental as well as the @simd macro for inner loop performance.","category":"page"},{"location":"motivation/#","page":"Motivation","title":"Motivation","text":"A side effect of the incredibly powerful documenting system of Julia is that one can go to where intrinsic functions are implemented and one is free to change them. However this also means that if a user wants to extend an intrinsic method they can use the documentation to navigate to where it is defined and see how it is implemented so they may extend it for their use case.","category":"page"}]
}

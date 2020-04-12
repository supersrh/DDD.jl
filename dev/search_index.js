var documenterSearchIndex = {"docs":
[{"location":"intro/#DDD.jl-Documentation-1","page":"DDD.jl","title":"DDD.jl Documentation","text":"","category":"section"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"DDD.jl was created with the aim to make 3D discrete dislocation dynamics research more tractable, transparent and productive.","category":"page"},{"location":"intro/#Objectives-1","page":"DDD.jl","title":"Objectives","text":"","category":"section"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"Dislocation dynamics is notoriously impenetrable due to the wide range of techniques and historically disparate sciences involved in their study. Lowering the barrier to entry and simplifying the workflows of experimental, theoretical and computational researchers will simplify the development of the field. Specifically, our objectives are to develop a codebase that meets the following requirements:","category":"page"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"ease of use\nsimulations are easy to set up\ninteractivity\nplotting and post-processing\ndata analysis\nautomatic error checking\nstop and restart capabilities\nease of development and maintenance\nreadable code\nmetaprogramming\nmacros (compile time execution)\ngenerated functions (custom functions generated by the code itself)\nproblem logging\nclear warnings, errors and debug information\neasy to add new validations\nhigh level abstractions\narray and matrix operations\nunicode support\ncode introspection\ninteractive debugger\nprofiling and benchmarking\nidentify bottlenecks, type instabilities before runtime\nminimal rewriting\nmodular\ngeneric functions\nself-containment\neasily parallelisable\nlocal parallelisation\ndistributed parallelisation\nGPU parallelisation\nwell documented\neasily add documentation\nnative LaTeX support\nautomatically generated\nwell developed testing capabilities\neasily add tests\neasily interpreted tests\ntest everything even logging events such as warnings and errors\nperformant\nuse as few languages as possible\nCUDA may be needed for specialised parallelisation but should not be a requirement\nself-contained\nno external dependencies\nopen-source, shareable, portable\npublically hosted\nstandardised IO (input-output)\nplug and play","category":"page"},{"location":"intro/#Likely-candidates.-1","page":"DDD.jl","title":"Likely candidates.","text":"","category":"section"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"Historically, two languages that have reigned supreme in the field of scientific computing Fortran and C, however with the advent of object-oriented programming, and interpreted languages that list has expanded. Here we offer some likely candidates to build our code. Some of which have been used in the past to create dislocation dynamics codes of different ilks.","category":"page"},{"location":"intro/#Fortran-(f90)-1","page":"DDD.jl","title":"Fortran (f90+)","text":"","category":"section"},{"location":"intro/#Advantages-1","page":"DDD.jl","title":"Advantages","text":"","category":"section"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"It is performant, readable, modular, open-source, highly abstracted, natively parallelisable (compiler dependent), and safe through the use of intent() inside functions. Documentation for the language itself is available on the f90 standard practices site and there is a sizeable knowledge base found in StackExchange and the Intel Fortran forums.","category":"page"},{"location":"intro/#Disadvantages-1","page":"DDD.jl","title":"Disadvantages","text":"","category":"section"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"It lacks interactivity, metaprogramming (aside from preprocessor macros), and a proper internal standard library. BLAS and LAPACK are as close to a standard library as Fortran gets, but they have to be installed and linked to at compilation time. Furthermore, different compilers break portability, in some cases what is performant code in one compiler is bad code in another. It also has nothing in the way of native testing and documenting, but there are Python tools to do so.","category":"page"},{"location":"intro/#C-1","page":"DDD.jl","title":"C","text":"","category":"section"},{"location":"intro/#Advantages-2","page":"DDD.jl","title":"Advantages","text":"","category":"section"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"It is performant, small, modular, open-source and compilers are highly standardised. There is no shortage of documentation for C all accross the internet.","category":"page"},{"location":"intro/#Disadvantages-2","page":"DDD.jl","title":"Disadvantages","text":"","category":"section"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"On top of lacking what Fortran also lacks, it has the added wrinkle of pointer arithmetic. Which is, famously, the cause of most C bugs. Some of which lead to obvious problems like segmentation faults and NaN values. Others are more quite a bit more insidious and opaque, such as pointer dereferencing and subtle function side effects. It also lends itself to memory leaks if the user does not manage memory properly, such bugs are hard to track, reproduce and often catastrophic because nobody notices memory leaks until they starts affecting other processes. Some very well-known bugs and exploits in commercial software such as Windows have been thanks to memory leaks, often going undiscovered for years and through multiple versions. C also doesn't offer anything in the way of abstraction other than structures.","category":"page"},{"location":"intro/#C-2","page":"DDD.jl","title":"C++","text":"","category":"section"},{"location":"intro/#Advantages-3","page":"DDD.jl","title":"Advantages","text":"","category":"section"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"It has an extensive standard library of optimised algorithms and data structures, all of which are excellently documented. It is open-source and its compilers are also highly standardised (though not as much as C). It also offers serious metaprogramming capabilities, and can be made to be very performant if used correctly, sometimes more so than a naïve C implementation. There are extensive knowledge bases of C++ but the problem is often in deciphering how one may adapt the posted solution to their specific situation.","category":"page"},{"location":"intro/#Disadvantages-3","page":"DDD.jl","title":"Disadvantages","text":"","category":"section"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"It is extremely is verbose, very difficult to learn and use correctly, opaque and unintuitive (new v.s. malloc(), del vs free(), namespaces). It mitigates some of the problems of C at the cost of runtime performance and added program complexity. It also tends to make debugging user defined code more difficult because one has to trawl through verbose, complicated syntax. It also requires external libraries to be installed and linked to during compilation.","category":"page"},{"location":"intro/#Python-1","page":"DDD.jl","title":"Python","text":"","category":"section"},{"location":"intro/#Advantages-4","page":"DDD.jl","title":"Advantages","text":"","category":"section"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"The golden child of interpreted languages is readable, easy to use, open-source, standardised, portable and interactive. It also has an even more extensive standard library than C++. Its vibrant package ecosystem ensures there are packages for every need and frees the user from worrying about external dependencies because they are taken care of by the package installer either automatically or by printing the command required to install the dependency. It has native documentation, testing and benchmarking capabilities. The language has an extremely high level of abstraction and is rapidly evolving, improving and expanding. Package documentation tends to be the gold standard for documentation across all languages by virtue of the sheer number of users and contributors. There is also an extensive knowledge base throughout the internet where solutions to problems have most likely already been posted about and found, if not, one can make a post and have their question answered rather quickly.","category":"page"},{"location":"intro/#Disadvantages-4","page":"DDD.jl","title":"Disadvantages","text":"","category":"section"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"It is not performant without serious modification like using Cython or by standard-breaking practices to use the JIT (just in time compiler) offered by numba. Packages such as numpy and scipy help in this regard, but more often than not, the number crunching is done via calls to C, CUDA and Fortran routines through wrappers or direct external calls. Python can also get somewhat verbose, particularly when using a few packages where namespaces must be distinguished by aliases. Standalone executables are much larger than they would be in other languages.","category":"page"},{"location":"intro/#Matlab-1","page":"DDD.jl","title":"Matlab","text":"","category":"section"},{"location":"intro/#Advantages-5","page":"DDD.jl","title":"Advantages","text":"","category":"section"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"Is readable, easy to use, standardised and interactive. It has native testing, documentation and benchmarking capabilities. The documentation for in-built functions is excellent. It offers limited object oriented capabilities, usually more than enough.","category":"page"},{"location":"intro/#Disadvantages-5","page":"DDD.jl","title":"Disadvantages","text":"","category":"section"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"It is closed-source and proprietary. Worse, many of the toolboxes and specialised features are not standard and require additional purchase. Furthermore, the knowledge base for specific questions is limited to the Mathworks forums where only people with Mathworks accounts may post. Increasingly, Matlab offers less and less in comparison to Python. Pretty much all of the performance issues are shared by both languages, but Python is free, open-source and has a massive community developing packages and adding functionality.","category":"page"},{"location":"intro/#Julia-1","page":"DDD.jl","title":"Julia","text":"","category":"section"},{"location":"intro/#Advantages-6","page":"DDD.jl","title":"Advantages","text":"","category":"section"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"Every advantage that Python offers is also offered by Julia, from the standard library to benchmarking and testing. Its package ecosystem and user base is nowhere near as large as Python's, but it offers the same functionality.","category":"page"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"Unlike any of the other languages we mentioned, Julia is a JIT (just in time) compiled language, just like Python when using numba. So it offers C and Fortran-like performance after a function has been executed once. It offers the same level of abstraction as Python and Matlab while keeping similar or even equivalent[^1 In most cases, the abstractions have a cost-benefit associated with using them, using introspection tools is recommended if performance is critical. Sometimes they outperform less abstracted implementations, but others a non-abstracted implementation is better.] performance to Fortran and C.","category":"page"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"One of the advantages of object-oriented code is reusability and expandability. Function dispatch in object-oriented languages depends on the function's class. However, Julia's multiple dispatch, type system, and JIT compilation takes code reusability to another level by letting functions specialise depending on the types of their arguments. This means that one can expand functions defined anywhere in the code by declaring them for new types. This means developers can write generic functions that can be expanded by users as they see fit. A concrete example we use in DDD.jl is in constructing dislocation loops. Where new types of loops or even special dislocation structures don't need their own data structure, one can simply declare a new constructor for a new type of loop and it will be called using the same user-interface.","category":"page"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"Furthermore, Julia can be used as both, a statically typed or dynamically typed language. If one wants performance, one gets performance by annotating types[^2 Types do not have to be known by the user before runtime, they can be given parametrically and the compiler will use the argument's type during runtime to compile a specialised function. This lets programs be generically typed without sacrificing performance or adding verbosity.] and writing well-defined code. If one wants to use Julia interactively like Python or Matlab, that works too. And the compiler will do its best to ensure the code is performant.","category":"page"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"Another aspect that Julia offers that none of the others do is the ability to look at the different stages of compilation. This lets developers and users identify areas where the code might suffer a runtime bottleneck before even running it. There are also extensive profiling, debugging and benchmarking tools that provide timing and memory allocation information. Out of the languages mentioned, Julia is the easiest to write performant code in.","category":"page"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"If this weren't enough, there is also native support for CPU and GPU parallelisation both local and distributed, as well as the ability to call external languages with a single interface. Its metaprogramming capabilities are on par with C++ but much more concise and less impactful on compilation time.","category":"page"},{"location":"intro/#Disadvantages-6","page":"DDD.jl","title":"Disadvantages","text":"","category":"section"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"Multiple dispatch can be abused by new users and may negatively impact performance. Precompilation time for packages and the \"time to first plot\" can be relatively long.","category":"page"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"It is a new language, things are changing rapidly and backwards compatibility may not always be guaranteed. There are also features that are experimental and subject to change, deprecation and removal. For example, 1.4 CPU parallelisation is experimental as well as the @simd macro for inner loop performance.","category":"page"},{"location":"intro/#","page":"DDD.jl","title":"DDD.jl","text":"A side effect of the incredibly powerful documenting system of Julia is that one can go to where intrinsic functions are implemented and one is free to change them. However this also means that if a user wants to extend an intrinsic method they can use the documentation to navigate to where it is defined and see how it is implemented so they may extend it for their use case.","category":"page"},{"location":"theory/#Discrete-Dislocation-Dynamics-1","page":"Discrete Dislocation Dynamics","title":"Discrete Dislocation Dynamics","text":"","category":"section"},{"location":"plotting/#Plotting-1","page":"Plotting","title":"Plotting","text":"","category":"section"},{"location":"#DDD.jl-1","page":"Index","title":"DDD.jl","text":"","category":"section"},{"location":"#","page":"Index","title":"Index","text":"Pages = [\"intro.md\"]\nDepth = 4","category":"page"},{"location":"#Index-1","page":"Index","title":"Index","text":"","category":"section"},{"location":"#","page":"Index","title":"Index","text":"","category":"page"},{"location":"io/#IO-1","page":"IO","title":"IO","text":"","category":"section"},{"location":"io/#Input-1","page":"IO","title":"Input","text":"","category":"section"},{"location":"io/#Output-1","page":"IO","title":"Output","text":"","category":"section"},{"location":"types/#Types-1","page":"Types","title":"Types","text":"","category":"section"},{"location":"types/#Primitive-Types-1","page":"Types","title":"Primitive Types","text":"","category":"section"},{"location":"types/#Composite-Types-1","page":"Types","title":"Composite Types","text":"","category":"section"}]
}

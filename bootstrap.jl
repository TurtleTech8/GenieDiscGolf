(pwd() != @__DIR__) && cd(@__DIR__) # allow starting app from bin/ dir

using GenieDiscGolf
const UserApp = GenieDiscGolf
GenieDiscGolf.main()

using Pkg


Pkg.resolve()
Pkg.instantiate()
Pkg.activate(".")


using Genie

Genie.loadapp()

up(port=9025, async = false)
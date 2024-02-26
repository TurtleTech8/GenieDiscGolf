using Genie.Router
using Genie.Genie.Renderer.Html
using Genie.Renderer.Json
using GenieDiscGolf.HomePageController
using GenieDiscGolf.SearchPageController
using GenieDiscGolf.DBController

route("/", HomePageController.index)

route("/search", SearchPageController.index)

route("/getSearchDiscs") do 
  json(DBController.getSearchDiscs())
end

route("/getAllDiscs") do 
  json(DBController.getAllDiscs())
end

route("/getAllBrands") do 
  json(DBController.getAllBrands())
end

route("/getDisc") do 
  json(DBController.getDisc(params(:name, "")))
end

route("/getRelatedDiscs") do 
  json(DBController.getRelatedDiscs(params(:name, "")))
end
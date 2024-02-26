module HomePageController

using Genie.Renderer.Html
using GenieDiscGolf.DBController

function index()
    # print(Mongoc.as_json(DBController.getDisc()))
    html(:DiscGolfApp, :HomePageController)
end

end
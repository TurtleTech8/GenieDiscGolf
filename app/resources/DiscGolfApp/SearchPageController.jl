module SearchPageController

using Genie.Renderer.Html

function index()
    html(:DiscGolfApp, :SearchPageController)
end

end
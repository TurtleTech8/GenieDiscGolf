module DBController

using Mongoc

const dbURI = "mongodb+srv://November:$(Main.UserApp.MongoDBPassword)@cluster0.fgs9tdn.mongodb.net/?retryWrites=true&w=majority"
const databaseName = "DiscGolf"
const collectionName = "Discs"

const CLIENT = Mongoc.Client(dbURI)
const DATABASE = Mongoc.Database(CLIENT, databaseName)
const COLLECTION = Mongoc.Collection(DATABASE, collectionName)

function toJSONList(cursor::Mongoc.Cursor)
    vect = Mongoc.collect(cursor)
    result = Vector{String}()
    for x in vect
        push!(result, Mongoc.as_json(x))
    end
    return result
end

function getAllDiscs()
    return toJSONList(Mongoc.find(COLLECTION, Mongoc.BSON("""{}"""), options=Mongoc.BSON("""{"projection": {"_id": false}, "sort": {"speed":-1, "fade": -1, "turn":-1} }""")))
end

function getAllBrands()
    reply = Mongoc.BSON()
    err_ref = Ref{Mongoc.BSONError}()
    ok = Mongoc.mongoc_database_command_simple(DATABASE.handle, Mongoc.BSON("""{"distinct": "Discs", "key":"brand"}""").handle, C_NULL, reply.handle, err_ref)
    if !ok
        throw(err_ref[])
    end
    return Vector{String}(reply["values"])
end

function getSearchDiscs()
    result = []
    for x in Mongoc.find(COLLECTION, Mongoc.BSON("""{}"""), options=Mongoc.BSON("""{"projection": {"_id": false, "name": true}}"""))
        push!(result, x["name"])
    end
    return result
end

function getDisc(name)
    return Mongoc.find_one(COLLECTION, Mongoc.BSON("""{"name_lower": "$name"}"""), options=Mongoc.BSON("""{"projection": {"_id": false}}"""))
end

function getRelatedDiscs(name)
    chosenDisc = getDisc(name)
    return toJSONList(Mongoc.find(COLLECTION,
                       Mongoc.BSON("""{
                        "speed": $(chosenDisc["speed"]),
                        "turn": $(chosenDisc["turn"]),
                        "fade": $(chosenDisc["fade"]),
                        "name_lower": {"\$ne": "$(chosenDisc["name_lower"])"}
                       }"""),
                       options=Mongoc.BSON("""{"projection": {"_id": false, "name": true, "distance_category": true}}""")))
end

end
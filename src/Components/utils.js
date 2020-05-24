import _ from "lodash"


export function paginate(items, pageNumber, pageSize, searchName, searchCategory)  {
    const startIndex = (pageNumber -1) * pageSize
    const itemsToReturn = []
    if(searchName == "" && searchCategory == "All") {
        return _(items).slice(startIndex).take(pageSize).values()
    }
    else if(searchName != "" && searchCategory == "All") {
        return _(items).slice(startIndex).take(pageSize).filter(v =>v.name == searchName).values()
    }

    else if(searchName == "" && searchCategory != "All") {
        return _(items).slice(startIndex).take(pageSize).filter(v =>v.category == searchCategory).values()
    }
    else if(searchName != "" && searchCategory != "All") {
        return _(items).slice(startIndex).take(pageSize).filter(v =>v.name == searchName && v.category == searchCategory).values()
    }
    else {
        return _(items).slice(startIndex).take(pageSize).filter(v =>v.name == searchName && v.category == searchCategory).values()
    }



}

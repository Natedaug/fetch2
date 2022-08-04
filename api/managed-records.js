//NKSTART HERE
//Error recover
import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...
function retrieve(options = {}) {
  //stuff
  if (!options.page) {
    options.page = 1;
  }
  async function getData() {
    const limit = 10;

    let uri = URI(window.path)
      .addSearch("limit", limit + 1)
      .addSearch("offset", (options.page - 1) * 10);
    if (options.colors) {
      uri.addSearch("color[]", options.colors);
    }

    try {
      const response = await fetch(uri);
      const data = await response.json();

      //transform response into newData
      //  {
      //    ids:[],
      //    open[{id: ?, color: "?", disposition: "open", isPrimary: ?}],
      //    closedPrimaryCount: ?,
      //    previousPage: ?,
      //    nextPage: ?
      //  }
      let newData = { ids: [], open: [], closedPrimaryCount: 0 };

      //check if last page and set prev and next and remove extra item
      if (data.length > limit) {
        newData.nextPage = options.page + 1;
        data.pop();
      } else {
        newData.nextPage = null;
      }
      if (options.page == 1) {
        newData.previousPage = null;
      } else {
        newData.previousPage = options.page - 1;
      }

      //loop thru data add to ids, check if open then check if primary color then add to open, if primary and open increment closedPrimaryCount
      //try to do all in one loop
      data.forEach((record) => {
        newData.ids.push(record.id);
        if (record.disposition == "open") {
          record.isPrimary = checkPrimary(record);
          newData.open.push(record);
        } else {
          if (checkPrimary(record)) {
            newData.closedPrimaryCount++;
          }
        }
      });

      return newData;
    } catch (error) {
      console.log("Fetch error: ", error);
    }
  }
  return getData();
}

function checkPrimary(item) {
  if (item.color == "red" || item.color == "blue" || item.color == "yellow") {
    return true;
  } else {
    return false;
  }
}

export default retrieve;

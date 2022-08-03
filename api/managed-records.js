//NKSTART HERE
//Put on GITHUB
import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...
function retrieve(options = { page: 1 }) {
  //stuff
  async function getData() {
    const limit = 10;

    let uri = URI(window.path)
      .addSearch("limit", limit + 1)
      .addSearch("offset", (options.page - 1) * 10);
    const response = await fetch(uri);
    const data = await response.json();

    alert(data);
    return data;
  }
  return getData();
}
export default retrieve;

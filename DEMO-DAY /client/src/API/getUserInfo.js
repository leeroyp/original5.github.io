import axios from "axios";

const getUserInfo = (userID) => {
    return(
        axios.get("/api/user/info?userID=" + userID).then((res) => {
            return res
          }).catch((error) => {
              console.log("ERROR", error)
          })
    );    
}

export default getUserInfo;
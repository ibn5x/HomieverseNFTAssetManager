Moralis.initialize("46RR5TNdCXfYsUcbHANUWgHjcFQBe4XjABOLPlKe"); // Application id from moralis.io
Moralis.serverURL = "https://pzzhabvtemxt.moralishost.com:2053/server"; //Server url from moralis.io
const CONTRACT_ADDRESS = "0x95709D42974cbdc1fa0DF6fF1090EcA58FF3D47b";
let currentUser;

getUserData = async () => {
    let accounts = currentUser.get('accounts');
    const  options = {chain: 'rinkeby', address: accounts[0], token_address: CONTRACT_ADDRESS};
    return Moralis.Web3API.account.getNFTsForContract(options).then( (data) => { 
      let result = data.result.reduce( (object, currentElement) =>{
              object[currentElement.token_id] = currentElement.amount;
              return object;
            }, {})

            return result;
    });
}

init = async () => {

    currentUser = await Moralis.User.current();
    if(!currentUser){
        $('#btn-login').show();
        $('#btn-logout').hide();
    }else if(currentUser){
        $('#btn-login').hide();
        $('#btn-logout').show(); 

        const options = {address: CONTRACT_ADDRESS, chain: "rinkeby"};
        let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
       
        let userData = await getUserData();
        getCollection(NFTs, userData);
        
    }

}

async function getCollection(NFTs, userData){

    let resultingData = [];
    let resData = [];
    let nftOwners = [];
    let nftIds = [];

    for(let count = 0; count < NFTs.result.length; count++){
     
        let nftId = NFTs.result[count].token_id;
        let num = 0;
        
        const options = { address: CONTRACT_ADDRESS, token_id: nftId, chain: "rinkeby" };
        let tokenIdOwners = await Moralis.Web3API.token.getTokenIdOwners(options); 

        let targetData = (tokenIdOwners.result[num].amount);
        let ownerData = (tokenIdOwners.result[num].owner_of);
        
        let info = NFTs.result[count].metadata;
        let data = info;
        let obj = JSON.parse(data);

        resultingData.push(obj);  
        nftOwners.push(ownerData);
        nftIds.push(tokenIdOwners.result[num].token_id)
        resData.push(targetData);
      
  }
        
    renderInventory(resultingData, resData, nftOwners, nftIds, userData);
           
}


function renderInventory(NFTs, resData, nftOwners, nftIds, userData){

    const parent = document.getElementById("appManager");

    for(let i = 0; 0 < NFTs.length; i++ ){
        const nft = NFTs[i];
        const resdata = resData[i];
        const nftowners = nftOwners[i];
        const nftids = nftIds[i];

        let trackerCount = userData[nftids];
        if(trackerCount === undefined){
            trackerCount = 0;
        }

        let htmlString = ` 
            <div class="card" style="">
                <img src="${nft.image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${nft.name}</h5>
                    <p class="card-text">${nft.description}</p>
                    <p class="card-text">amount: ${resdata}</p>
                    <p class="card-text">Owner: ${nftowners}</p>
                    <p class="card-text">Your Balance: ${trackerCount}</p>
                    <a href="./mint.html?nftId=${nftids}" class="btn btn-primary">Mint</a>
                    <a href="./burn.html?nftId=${nftids}" class="btn btn-primary">Burn</a>
                    <a href="./transfer.html?nftId=${nftids}" class="btn btn-primary">Transfer</a>
                </div>
            </div>
        `;
      
        let col = document.createElement("div");
        col.className = "col col-md-4";
        col.style = "margin-bottom: 30px";
        col.innerHTML = htmlString;
        parent.appendChild(col);
    }

}

login = async() => {
    currentUser = await Moralis.User.current();

    if(!currentUser){

        Moralis.Web3.authenticate().then(function (currentUser) {
            console.log(currentUser.get('ethAddress'))
            alert("Login for user: " + currentUser.get('ethAddress'));
        })

      $('#btn-login').hide();
      $('#btn-logout').show();   
      
      //Get all NFTs owned by user
      const options = {address: CONTRACT_ADDRESS, chain: "rinkeby"};
      let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);

       getCollection(NFTs);
        
    }
    
}

logout = async() =>{  

    await Moralis.User.logOut()
    $('#btn-login').show();
    $('#btn-logout').hide();
    location.reload();   
    alert("you have been signed out");
}

function refreshContract(){
    location.reload(); 
}

document.getElementById('btn-login').onclick = login;
document.getElementById('btn-logout').onclick = logout;
document.getElementById('btn-smartContract').onclick = refreshContract;

init();
Moralis.initialize("46RR5TNdCXfYsUcbHANUWgHjcFQBe4XjABOLPlKe"); // Application id from moralis.io
Moralis.serverURL = "https://pzzhabvtemxt.moralishost.com:2053/server"; //Server url from moralis.io
const CONTRACT_ADDRESS = "0x95709D42974cbdc1fa0DF6fF1090EcA58FF3D47b";
let web3; // set empty web3 object will initialzie in init. required to make calls to smart contract

init = async () =>{
    let currentUser = await Moralis.User.current();

    if(!currentUser){
        window.location.pathname = "./HomieverseNFTAssetManager/index.html"; 
    }

    web3 = await Moralis.Web3.enable(); //initiaizing web3 library via moralis
    let accounts = await web3.eth.getAccounts();
    console.log(accounts);

    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId"); 
    //console.log(nftId);
    document.getElementById('token_id_input').value = nftId; //prepopulate id
    document.getElementById('address_input').value = accounts[0]; //prepopulate address
}

burn = async () => {
    
    let tokenId = parseInt(document.getElementById('token_id_input').value);
    let address = document.getElementById('address_input').value;
    let amount = parseInt(document.getElementById('amount_input').value);
    
    const accounts = await web3.eth.getAccounts(); //gets current metamask user
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
    
    contract.methods.burn(address, tokenId, amount).send({from: accounts[0], value: 0})
    .on("receipt", function(receipt){
        alert("Burn Completed");
        console.log(receipt);
    });
}

document.getElementById('submit_burn').onclick = burn;

init();
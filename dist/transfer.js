Moralis.initialize("46RR5TNdCXfYsUcbHANUWgHjcFQBe4XjABOLPlKe"); // Application id from moralis.io
Moralis.serverURL = "https://pzzhabvtemxt.moralishost.com:2053/server"; //Server url from moralis.io
const CONTRACT_ADDRESS = "0x95709D42974cbdc1fa0DF6fF1090EcA58FF3D47b";


init = async () =>{
    let currentUser = await Moralis.User.current();

    if(!currentUser){
        window.location.pathname = "./HomieverseNFTAssetManager/index.html"; 
    }

    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId"); 
   
    document.getElementById('token_id_input').value = nftId; //prepopulate id
    
}

transfer = async () => {
    
    let tokenId = parseInt(document.getElementById('token_id_input').value);
    let address = document.getElementById('address_input').value;
    let amount = parseInt(document.getElementById('amount_input').value);
    
    // sending 15 tokens with token id = 1
    const options = {type: "erc1155",  
    receiver: address,
    contract_address: CONTRACT_ADDRESS,
    token_id: tokenId,
    amount: amount}
    
    let result = await Moralis.transfer(options)
    console.log(result);
}

document.getElementById('submit_transfer').onclick = transfer;

init();
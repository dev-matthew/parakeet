var account;

const red = "red";
const green = "#17D346";
const networks = {
    "0x1": "ETH Mainnet",
    "0x89": "Polygon",
    "0x3": "Ropsten",
    "0x2a": "Kovan",
    "0x4": "Rinkeby",
    "0x5": "Goerli",
    "0xa86a": "Avalanche"
}

window.addEventListener("load", function() {
    if (typeof window.ethereum !== "undefined") {
        getAccount();
    } else {
        setAccountStatus("Not connected", red);
    }
});

document.getElementById("connect-metamask").addEventListener("click", function() {
    if (typeof window.ethereum !== "undefined") {
        getAccount();
    } else {
        setAccountStatus("Not connected", red);
        alert("Please install MetaMask");
    }
});

async function getAccount() {
    try {
        let accounts = await ethereum.request({method: "eth_requestAccounts"});
        account = accounts[0];
        setAccountStatus(account, green);
        setNetwork();
        ethereum.on('chainChanged', (_chainId) => window.location.reload());
    } catch(error) {
        setAccountStatus("Not connected", red);
    }
}

function setAccountStatus(status, color) {
    document.getElementById("account-status").innerHTML = "Account: " + status;
    document.getElementById("account-status-icon").style.backgroundColor = color;
    document.getElementById("account-status-icon").style.boxShadow = "0px 0px 10px 1px " + color;
}

async function setNetwork() {
    const chain_id = await ethereum.request({method: "eth_chainId"});
    if (Object.keys(networks).includes(chain_id)) {
        document.getElementById("network").innerHTML = "Network: " + networks[chain_id];
    } else {
        document.getElementById("network").innerHTML = "Network: " + chain_id;
    }

    loadInventory();
}

function loadInventory() {

}
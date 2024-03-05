import { ethers } from "ethers";
import * as ReactBootStrap from "react-bootstrap";
import { useState, useEffect } from "react";
import ABIFILE from "./artifacts/contracts/BlockchainVoting.sol/BlockchainVoting.json";
import FatcVoter from "./comp/FatcVoter";
import Propsal from "./comp/Propsal";
import Set from "./comp/FatchCandi";
import Vote from "./comp/Vote";
const ABI = ABIFILE.abi;
const ContractAddress = "0x632325aA46149c4b76804a3DDC25d63B21A2Cf81";

function App() {
  const [role, setRole] = useState("");
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isoff, setOff] = useState(false);
  const [loading, setLoading] = useState(false);

  const Dicconnect = async () => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("Connected")) {
        window.localStorage.removeItem("Connected");
        setOff(false);
        window.location.reload();
      } else {
      }
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("Connected") && role) {
        Connect();
      }
    }
  }, []);

  const Connect = async (e) => {
    // e.preventDefault();
    setLoading(true);
    if (typeof window.ethereum !== "undefined") {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setOff(true);
      window.localStorage.setItem("Connected", "injected");
      console.log(account);
      setAccount(account);
      document.getElementById("connectbtn").innerHTML = account;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("chainId: ",provider)
      setProvider(provider);

      const signer = provider.getSigner();
      console.log(signer);
      const contract = new ethers.Contract(ContractAddress, ABI, signer);
      setContract(contract);
      console.log(contract);
    }
  };
  return (
    <div
      className="mx-auto p-4 text-light  "
      style={{
        width: 1000,
        marginTop: 25,
        backgroundColor: "rgb(135,62,35)",
      }}
    >
      <p className="text-center h5 text-warning p-2">
        Blockchain for Electronic Voting System
      </p>
      {!role ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => {
              setRole("voter");
            }}
            className="btn btn-primary"
            style={{ margin: 100}}
          >
            Voter
          </button>
          <button
            onClick={() => {
              setRole("admin");
            }}
            className="btn btn-dark text-light"
            style={{ margin: 100}}
          >
            Admin
          </button>
        </div>
      ) : (
        <div className="d-flex justify-content-between">
          <button
            onClick={Connect}
            id="connectbtn"
            className="btn btn-success mx-2"
          >
            {!loading ? (
              "Connect"
            ) : (
              <ReactBootStrap.Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </button>

          <button
            onClick={Dicconnect}
            id="Dissconnectbtn"
            className="btn btn-success mx-2"
            disabled={!isoff}
          >
            Disconnect
          </button>
        </div>
      )}

      <br></br>
      {role === "voter" && (
        <>
          <Set contract={contract} account={account} provider={provider} />
          <Vote contract={contract} account={account} provider={provider} />
          <FatcVoter
            contract={contract}
            account={account}
            provider={provider}
          />
        </>
      )}
      {role === "admin" && (
        <>
          <Set contract={contract} account={account} provider={provider} />
          <Propsal contract={contract} account={account} provider={provider} />
        </>
      )}
    </div>
  );
}

export default App;

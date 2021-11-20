import Web3 from "web3";
import React from "react";
import {WalletAbstract} from "@src/wallets/wallet-abstract";
import {dec2hex} from "@src/utils";

export class WalletMetamask extends WalletAbstract {
    constructor() {
        super();
        this.type = 'metamask';
    }

    checkConnection = async () => {
        await this.query('eth_accounts');
        return this;
    }

    connect = async () => {
        await this.query('eth_requestAccounts');
        return this;
    }

    async query(method) {
        if (window.ethereum) {
            try {
                const addressArray = await window.ethereum.request({method});

                if (!addressArray.length) {
                    return;
                }
                this.address = addressArray[0];
            } catch (err) {
                this.error = err.message;
            }
        } else {
            this.error = (
                <span>
                    Please install <a target='_blank' href={`https://metamask.io/download.html`}>Metamask</a>,
                    a virtual Ethereum wallet, in your browser.
                </span>
            )
        }
    }

}
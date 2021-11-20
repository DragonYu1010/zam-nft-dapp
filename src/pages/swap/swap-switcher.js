import React, {useContext, useState, useMemo, useEffect} from 'react';
import {SelectComponent} from "@src/components/fields/Select";
import {CHAIN_ID_BINANCE, TOKEN_USDT, TOKEN_ZAM, TOKENS} from "@src/constants";
import {ModalWalletContext, RateContext, SwapContext, WalletContext} from "@src/context";
import {float, toFixed, int} from "@src/utils";
import {swapAction} from "@src/actions/swapAction";
import {IconArrowLeft, IconFilter} from "@src/icons/icons";
import {Tooltip} from "@src/components/fields/Tooltip";

const optionsTokens = [
    {
        value: TOKEN_ZAM,
        label: <div className="select-field__token">
            <img alt="" src={TOKENS[TOKEN_ZAM].icon} height="30px" width="30px"/>{TOKENS[TOKEN_ZAM].name}
        </div>
    },
    {
        value: TOKEN_USDT,
        label: <div className="select-field__token">
            <img alt="" src={TOKENS[TOKEN_USDT].icon} height="30px" width="30px"/>{TOKENS[TOKEN_USDT].name}
        </div>
    },
];

const getOptionByValue = (token) => optionsTokens[optionsTokens.findIndex(option => option.value === token)];

const defaultSlippage = .1;

const slippageText = `Slippage is when there is a price difference from the amount of the original market order and 
the actual price paid of a stock.`;

export const SwapSwitcher = ({mainToken}) => {
    const {rate} = useContext(RateContext);
    const {swapFrom, swapTo, setSwapFrom, setSwapTo} = useContext(SwapContext);
    const [valueFrom, setValueFrom] = useState(0);
    const [valueTo, setValueTo] = useState(0);
    const inputRefFrom = React.createRef();
    const inputRefTo = React.createRef();
    const {setModalOpen} = useContext(ModalWalletContext);
    const {wallet, walletError, setWalletError} = useContext(WalletContext);
    const [lastInput, setLastInput] = useState('from');
    const [allowance, setAllowance] = useState({});
    const [filterActive, setFilterActive] = useState();
    const [slippage, setSlippage] = useState(defaultSlippage);
    const [deadline, setDeadline] = useState(30);

    useEffect(() => {
        return () => {
            setWalletError(null)
        }
    }, []);

    useEffect(async () => {
        const allowance = await new swapAction(wallet, swapFrom, swapTo).getAllowance();
        setAllowance(allowance);

        const chainId = await wallet.getChainId();

        if (chainId !== CHAIN_ID_BINANCE) {
            setWalletError('Please switch you wallet to Binance Smart Chain network.');
        }

    }, [wallet]);

    useEffect(async () => {
        const swap = new swapAction(wallet, swapFrom, swapTo);

        if (lastInput === 'from') {
            const amountB = await swap.getAmountB(valueFrom);
            setValueTo(amountB);
        } else if (lastInput === 'to') {
            const amountA = await swap.getAmountA(valueTo);
            setValueFrom(amountA);
        }
    }, [valueTo, valueFrom, swapFrom, swapTo])


    const handleChange = (option, type) => {
        if (type === 'from') {
            if (option.value === swapTo) {
                setSwapTo(swapFrom);
            }
            setSwapFrom(option.value);
        } else {
            if (option.value === swapFrom) {
                setSwapFrom(swapTo);
            }
            setSwapTo(option.value);
        }
    }

    const revertHandler = (event) => {
        event.preventDefault();
        setSwapFrom(swapTo);
        setSwapTo(swapFrom);
    }

    const changeValueFrom = (event) => {
        setValueFrom(parseInt(event.target.value))
        setLastInput('from');
    }
    const changeValueTo = (event) => {
        setValueTo(parseInt(event.target.value))
        setLastInput('to');
    }
    const approve = async () => {
        await new swapAction(wallet, swapFrom, swapTo).approve();
    }
    const swapHandler = async () => {
        if (!valueFrom || !valueTo) {
            return;
        }
        await new swapAction(wallet, swapFrom, swapTo).swap(valueFrom, valueTo, slippage, deadline);
    }

    let partAppove;

    if (!Object.keys(allowance).length) {
        partAppove = null;
    } else if (!allowance.allowanceA && !allowance.allowanceB) {
        partAppove = 0;
    } else if (!allowance.allowanceA || !allowance.allowanceB) {
        partAppove = 1;
    } else {
        partAppove = 2;
    }

    const setCustomSlippage = (e) => {
        const {value} = e.target;
        let parsedValue = value === '' ? defaultSlippage : float(value);
        if (parsedValue > 100) {
            parsedValue = 100;
        }
        setSlippage(parsedValue);
    }

    return (
        <>
            {
                !filterActive
                    ?
                    <div className="card card-filled card-narrow card-glow swap-switcher">
                        <button className="swap-switcher__settings" onClick={() => setFilterActive(true)}><IconFilter/>
                        </button>
                        <h3 className="title text-center mb-20">
                            Swap
                        </h3>

                        <label className="input-field__label">From</label>
                        <div className="input-field mt-10">
                            <div className="input-field__column">
                                <SelectComponent
                                    classNamePrefix="select-field"
                                    className="select-field select-field-transparent"
                                    onChange={(selectedOption) => handleChange(selectedOption, 'from')}
                                    defaultValue={getOptionByValue(swapFrom)}
                                    value={getOptionByValue(swapFrom)}
                                    options={optionsTokens}
                                />
                            </div>
                            <div className="input-field__column">
                                <input className="input-field__input text-right"
                                       ref={inputRefFrom}
                                       onChange={changeValueFrom}
                                       value={valueFrom || ''} placeholder="0"/>
                            </div>
                            <div className="input-field__column input-field__column--token-name"
                                 onClick={() => inputRefFrom.current.focus()}>
                                <div className="input-field__input">{TOKENS[swapFrom].name}</div>
                            </div>

                        </div>

                        <div className="swap-switcher__revert mt-20">
                            <a href="#" onClick={revertHandler}>
                                <img src="images/icon_revert.svg" alt=""/>
                            </a>
                        </div>

                        <label className="input-field__label">To (Estimated)</label>
                        <div className="input-field mt-10">
                            <div className="input-field__column">
                                <SelectComponent
                                    classNamePrefix="select-field"
                                    className="select-field select-field-transparent"
                                    onChange={(selectedOption) => handleChange(selectedOption, 'to')}
                                    defaultValue={getOptionByValue(swapTo)}
                                    value={getOptionByValue(swapTo)}
                                    options={optionsTokens}
                                />
                            </div>
                            <div className="input-field__column">
                                <input className="input-field__input text-right"
                                       ref={inputRefTo}
                                       onChange={changeValueTo}
                                       value={valueTo || ''} placeholder="0"/>
                            </div>
                            <div className="input-field__column input-field__column--token-name"
                                 onClick={() => inputRefTo.current.focus()}>
                                <div className="input-field__input">{TOKENS[swapTo].name}</div>
                            </div>
                        </div>

                        <div className="swap-switcher__rate">
                            1 {TOKENS[swapFrom].name} ≈ {swapFrom === mainToken ? rate : toFixed(1 / rate)} {TOKENS[swapTo].name}
                        </div>

                        {
                            !walletError ?
                                wallet?.address ?
                                    (
                                        partAppove === 2 ?
                                            <button className="button-green w-full" disabled={!valueFrom || !valueTo}
                                                    onClick={swapHandler}>{valueFrom && valueTo ? 'Swap' : 'Enter Amount'}</button>
                                            :
                                            (
                                                partAppove !== null ?
                                                    <>
                                                        <div className="swap-switcher__approve">
                                                            <span>Approved progress:</span>
                                                            <span>{partAppove}/2</span>
                                                        </div>
                                                        <button className="button-green w-full"
                                                                onClick={approve}>Approve
                                                        </button>
                                                    </>
                                                    : ''
                                            )
                                    )
                                    :
                                    <button className="button-green w-full" onClick={() => setModalOpen(true)}>Connect
                                        Wallet</button>
                                : ''
                        }

                    </div>
                    :
                    <div className="card card-narrow card-glow swap-settings">
                        <div className="swap-settings__header">
                            <button className="swap-settings__arrow" onClick={() => setFilterActive(false)}>
                                <IconArrowLeft/>
                            </button>
                            <h3 className="title text-center mb-20">
                                Settings
                            </h3>
                        </div>

                        <div className="swap-settings__content">
                            <label className="input-field__label">Slippage Tolerance <Tooltip text={slippageText}/></label>
                            <div className="input-field mt-10 mb-40">
                                <div className="input-field__column swap-settings__slippage">
                                    <button className={slippage === .1 ? 'active' : ''}
                                            onClick={() => setSlippage(.1)}>0.1%
                                    </button>
                                </div>
                                <div className="input-field__column swap-settings__slippage">
                                    <button className={slippage === .5 ? 'active' : ''}
                                            onClick={() => setSlippage(.5)}>0.5%
                                    </button>
                                </div>
                                <div className="input-field__column swap-settings__slippage">
                                    <button className={slippage === 1 ? 'active' : ''}
                                            onClick={() => setSlippage(1)}>1%
                                    </button>
                                </div>
                                <div className="input-field__column ">
                                    <input className="input-field__input text-right swap-settings__slippage"
                                           onChange={setCustomSlippage}
                                           value={slippage && ![0.1, 0.5, 1].includes(slippage) ? slippage : ''}
                                           placeholder="Custom"/>
                                </div>
                            </div>

                            <label className="input-field__label">Transaction Deadline <Tooltip text={slippageText}/></label>
                            <div className="input-field mt-10">
                                <div className="input-field__column swap-settings__slippage">
                                    <input className="input-field__input"
                                           onChange={(e) => setDeadline(int(e.target.value))}
                                           value={deadline || ''}
                                           placeholder="Custom"/>
                                </div>
                                <div className="input-field__column text-right">
                                    <input className="input-field__input text-right swap-settings__slippage"
                                           disabled={true}
                                           placeholder="minutes"/>
                                </div>
                            </div>
                        </div>


                    </div>
            }
        </>
    );
};
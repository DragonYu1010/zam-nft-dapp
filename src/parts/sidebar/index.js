import React, {useContext, useState} from 'react';
import {
    IconAppApple, IconAppGoogle,
    IconBridge,
    IconDashboard,
    IconExchange,
    IconFarming,
    IconHelp,
    IconStacking,
    IconWallet
} from "../../icons/icons.js";

import {
    BrowserRouter as Router,
    Link,
    NavLink,
    withRouter
} from "react-router-dom";
import {RateContext} from "@src/context";
import {IconMore} from "@src/icons/icons";


const Sidebar = (props) => {
    const [navIsOpen, setNavIsOpen] = useState(false);
    const {rate} = useContext(RateContext);

    return <aside className="sidebar">
        <div className={`sidebar__container ${navIsOpen ? 'sidebar__container-active' : ''}`}>
            <div className={`sidebar__bottom ${!navIsOpen ? 'sidebar__bottom-hidden' : ''}`}>
                <nav className="sidebar__nav">

                    <ul>
                        <li className="sidebar__nav-box">
                            <Link to="/z-meta-board" className={`sidebar__nav-item ${props.location?.pathname === '/z-meta-board' ? `active` : ''}`}>
                                <div className="sidebar__nav-icon">
                                    <IconDashboard />
                                </div>
                                <span>zMetaBoard</span>
                            </Link>
                        </li>
                        <li className="sidebar__nav-box"><a className="sidebar__nav-item disabled">
                            <div className="sidebar__nav-icon">
                                <IconWallet />
                            </div>
                            <span>Invest Portfolios</span></a></li>
                        <li className="sidebar__nav-box">
                            <Link to="/swap" className={`sidebar__nav-item ${props.location?.pathname === '/swap' ? `active` : ''}`}>
                                <div className="sidebar__nav-icon">
                                    <IconExchange />
                                </div>
                                <span>Swap</span>
                            </Link>
                        </li>
                        <li className="sidebar__nav-box">
                            <Link to="/bridge" className={`sidebar__nav-item ${props.location?.pathname === '/bridge' ? `active` : ''}`}>
                                <div className="sidebar__nav-icon">
                                    <IconBridge />
                                </div>
                                <span><b>Zamio</b> Bridge</span>
                            </Link>
                        </li>
                        <li className="sidebar__nav-box sidebar__nav-more">
                            <a href="#" className={`sidebar__nav-item active`}>
                                <div className="sidebar__nav-icon">
                                    <IconMore />
                                </div>
                                <span>More</span>
                            </a>
                        </li>
                        
                        <li className="sidebar__nav-box sidebar__nav-hidden-m">
                            <Link to="/staking" className={`sidebar__nav-item ${props.location?.pathname === '/staking' ? `active` : ''}`}>
                                <div className="sidebar__nav-icon">
                                    <IconStacking />
                                </div>
                                <span>Staking</span>
                            </Link>
                        </li>
                        <li className="sidebar__nav-box sidebar__nav-hidden-m">
                            <Link to="/farming" className={`sidebar__nav-item ${props.location?.pathname === '/farming' ? `active` : ''}`}>
                                <div className="sidebar__nav-icon">
                                    <IconFarming />
                                </div>
                                <span>Farming</span>
                            </Link>
                        </li>
                        <li className="sidebar__nav-box sidebar__nav-hidden-m"><a target="_blank" href="/faq" className="sidebar__nav-item">
                            <div className="sidebar__nav-icon">
                                <IconHelp />
                            </div>
                            <span>FAQ</span></a></li>
                    </ul>

                </nav>
            </div>

            <div className="sidebar__footer">
                <div className="sidebar__zamwallet">
                    <img className="sidebar__zamwallet-image"
                        src="images/icon_app_big.png"
                        srcSet="images/icon_app_big.png 1x, images/icon_app_big@2x.png 2x" />
                    <div className="sidebar__zamwallet-text">
                        <b>Get ZamWallet</b>
                        <div className="sidebar__zamwallet-apps">
                            <a href="https://apps.apple.com/ru/app/zam-wallet/id1436344249" target="_blank"
                                className="sidebar__zamwallet-app sidebar__zamwallet-app-apple">
                                <IconAppApple />
                            </a>
                            <a href="https://play.google.com/store/apps/details?id=zam.wallet" target="_blank"
                                className="sidebar__zamwallet-app">
                                <IconAppGoogle />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="sidebar__balance">
                    <div className="sidebar__balance-token">
                        <img src="images/tokens/icon_token_zam.svg" height="30px" width="30px" />
                        ZAM
                    </div>
                    <div className="sidebar__balance-price">
                        ${rate}
                    </div>
                </div>
            </div>

        </div>
    </aside>
};

export default withRouter(Sidebar);

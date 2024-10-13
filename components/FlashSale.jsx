// components/FlashSale.js
import React from 'react';
import styles from './FlashSale.module.css'; // Import the CSS module

const FlashSale = () => {
    return (
        <div className={styles.trending}>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={`${styles.sectop} ${styles.flexitem}`}>
                        <h2>
                            <span className={styles.circle}></span>
                            <span>FLASH SALE</span>
                        </h2>
                    </div>
                    <div className={styles.column}>
                        <div className={styles.flexwrap}>
                            <div className={`${styles.row} ${styles.products} ${styles.big}`}>
                                <div className={styles.item}>
                                    <div className={styles.offer}>
                                        <p>Berakhir Dalam</p>
                                        <ul className={styles.flexcenter}>
                                            <li>23</li>
                                            <li>15</li>
                                            <li>27</li>
                                            <li>60</li>
                                        </ul>
                                    </div>
                                    <div className={styles.media}>
                                        <div className={styles.image}>
                                            <a href="#">
                                                <img
                                                    src="assets/img/products/jas345.jpg"
                                                    alt="Korean Style: Dapatkan Jas Wanita dengan Harga Terbaik"
                                                />
                                            </a>
                                        </div>
                                        <div className={styles.hoverable}>
                                            <ul>
                                                <li className={styles.active}>
                                                    <a href="#"><i className="ri-heart-line"></i></a>
                                                </li>
                                                <li>
                                                    <a href="#"><i className="ri-eye-line"></i></a>
                                                </li>
                                                <li>
                                                    <a href="#"><i className="ri-shuffle-line"></i></a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className={`${styles.discount} ${styles.circle} ${styles.flexcenter}`}>
                                            <span>45%</span>
                                        </div>
                                    </div>
                                    <div className={styles.content}>
                                        <div className={styles.rating}>
                                            <div className={styles.stars}></div>
                                            <span className={styles['mini-text']}> (2.548)</span>
                                        </div>
                                        <h3 className={styles['main-links']}>
                                            <a href="#">Korean Style: Dapatkan Jas Wanita dengan Harga Terbaik</a>
                                        </h3>
                                        <div className={styles.price}>
                                            <span className={styles.current}>Rp 554.500</span>
                                            <span className={`${styles['normal']} ${styles['mini-text']}`}>Rp 990.000</span>
                                        </div>
                                        <div className={styles['stock']} className={styles['mini-text']}>
                                            <div className={styles.qty}>
                                                <span>Stok: <strong className={styles['qty-available']}>187</strong></span>
                                                <span>Terjual: <strong className={styles['qty-sold']}>3.725</strong></span>
                                            </div>
                                            <div className={styles.bar}>
                                                <div className={styles.available}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashSale;

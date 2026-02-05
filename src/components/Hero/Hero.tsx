import React from 'react';
import Link from '@docusaurus/Link';
import styles from './Hero.module.css';

export default function Hero(): JSX.Element {
    return (
        <section className={styles.hero}>
            <div className={styles.heroBackground}>
                <div className={styles.gridPattern}></div>
                <div className={styles.gradientOrb1}></div>
                <div className={styles.gradientOrb2}></div>
            </div>

            <div className={styles.heroContent}>
                <div className={styles.badge}>
                    <span className={styles.badgeIcon}>🛡️</span>
                    <span>Web3 Security Research Platform</span>
                </div>

                <h1 className={styles.heroTitle}>
                    Securing the Future of
                    <span className={styles.gradientText}> Web3</span>
                </h1>

                <p className={styles.heroSubtitle}>
                    Advanced blockchain security research, smart contract audits, and vulnerability analysis.
                    Protecting the decentralized ecosystem with cutting-edge security insights.
                </p>

                <div className={styles.heroButtons}>
                    <Link
                        className={styles.primaryButton}
                        to="/">
                        <span>Explore Research</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>

                    <Link
                        className={styles.secondaryButton}
                        to="/tags">
                        <span>Browse Topics</span>
                    </Link>
                </div>

                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <div className={styles.statValue}>$180B+</div>
                        <div className={styles.statLabel}>Value Protected</div>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.statItem}>
                        <div className={styles.statValue}>1000+</div>
                        <div className={styles.statLabel}>Vulnerabilities Found</div>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.statItem}>
                        <div className={styles.statValue}>24/7</div>
                        <div className={styles.statLabel}>Security Monitoring</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

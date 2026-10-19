import { lazy, Suspense, useState } from "react";
import "./style.css";
// import { ShortCode } from "../../url/components/encoder/index";
import { useUrlStore } from "../../url/states/url-state";

const ShortCode = lazy(()=> import("../../url/components/encoder/index"))

export function Home() {

    const url = useUrlStore(state => state.url)
    const shortCode = useUrlStore(state => state.shortCode)
    const error = useUrlStore(state => state.error)
    const loaded = useUrlStore(state => state.loaded)


    return (
        <>
            <div className="page">
                <section className="content">
                    <h1 className="content-title">Encurte uma URL</h1>
                    <p className="content-subtitle">
                        Cole o link longo abaixo e gere um endereço curto para compartilhar.
                    </p>

                    <Suspense fallback={<div>Carregando formulário...</div>}>
                        <ShortCode></ShortCode>
                    </Suspense>

                    {shortCode != null && loaded && error == null ? (
                        <div className="result">
                            <section className="result-content">
                                <div className="result-content-information">
                                    <p className="inform inform-linked">Link criado</p>
                                    <p className="inform">agora mesmo</p>
                                </div>
                                <div className="result-content-shortCode">
                                    <p>localhost:3000/{shortCode}</p>
                                </div>
                                <p className="result-content-targetUrl">
                                    Original: {url}
                                </p>
                            </section>
                            <section className="result-buttons">
                                <button
                                    type="button"
                                    className="shorten-btn"
                                    onClick={() => {
                                        if (shortCode) {
                                            navigator.clipboard.writeText(`http://localhost:3000/${shortCode}`);
                                        }
                                    }}
                                >
                                    Copiar
                                </button>
                                <button
                                    type="button"
                                    className="shorten-btn open"
                                    onClick={() => {
                                        if (url) {
                                            window.open(url, '_blank');
                                        }
                                    }}
                                >
                                    Abrir
                                </button>
                            </section>
                        </div>
                    ) : error != null ? (
                        <div className="placeholder">
                            <span className="placeholder-message">{error}</span>
                        </div>
                    ) : (
                        <div className="placeholder">
                            <span className="placeholder-message">
                                O link curto aparece aqui depois de encurtar
                            </span>
                        </div>
                    )}
                </section>
            </div>
        </>

    )
}
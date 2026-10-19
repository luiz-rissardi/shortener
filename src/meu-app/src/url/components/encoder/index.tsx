import { useState } from "react";
import './index.css';
import { useUrlStore } from "../../states/url-state.ts";



export function ShortCode() {

    const { url, shortCode, error, loaded, setError, setShortCode, setUrl } = useUrlStore();
    const [touched, setTouched] = useState<boolean>(false);
    

    // Função de validação simples (equivalente à regra do Angular)
    const validateUrl = (value: string | null) => {
        if (!value) {
            return 'A URL é obrigatória.';
        }
        try {
            new URL(value);
            return null;
        } catch {
            return 'Por favor, insira uma URL válida.';
        }
    };

    const handleChange = (e: any) => {
        const value = e.target.value;
        setUrl(value);
        // Valida em tempo real ou atualiza o erro conforme digita
        setError(validateUrl(value));
    };

    const handleBlur = () => {
        setTouched(true);
        setError(validateUrl(url));
    };

    const handleSubmit = (e:any) => {
        e.preventDefault();
        setTouched(true);
        const validationError = validateUrl(url);
        setError(validationError);

        if (!validationError) {
            // Lógica de envio do formulário aqui
            setShortCode("HSTAYUDL");
            console.log(url,shortCode,error,loaded)
        }
    };

    // Condição para exibir o erro (equivalente ao @if do Angular)
    const showError = touched && error !== null;

    return (
        <form className="shorten-form" onSubmit={handleSubmit}>
            <div className="shorten-form-field">
                <label className="shorten-form-label" htmlFor="targetUrl">
                    URL original
                </label>
                <div className="shorten-form-row">
                    <input
                        id="targetUrl"
                        className="shorten-form-input"
                        type="url"
                        value={url || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="https://exemplo.com/pagina-com-endereco-muito-longo"
                        autoComplete="off"
                    />
                    <button type="submit" className="shorten-btn">
                        Encurtar
                    </button>
                </div>

                {showError && (
                    <span className="input-invalid">{error}</span>
                )}
            </div>
        </form>
    );
}
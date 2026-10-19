import { lazy, Suspense } from 'react';
import "./index.css";

// Componente carregado de forma diferida (equivalente ao @defer)
const ShortCode = lazy(()=> import("../../url/components/encoder/index"))


function truncateText(text:string, maxLength:number = 40):string{
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

function copy(shortCode:string) {
  navigator.clipboard.writeText(`http://localhost:3000/${shortCode}`)
}



export function UrlList() {
const urls:any[] = [];
  const isLoaded = false;

  return (
    <div className="page">

          <Suspense fallback={<div>Carregando...</div>}>
            <ShortCode />
          </Suspense>

      <section className="table-information">
        <h2 className="table-information-title">Links criados</h2>
        <p className="table-information-description">
          {urls.length} links
        </p>
      </section>

      <div className="table-container">
        <table className="links-table">
          <thead>
            <tr>
              <th className="col-original">URL Original</th>
              <th className="col-short">URL Curta</th>
              <th className="col-date">Criado em</th>
              <th className="col-clicks" style={{ textAlign: 'center' }}>Cliques</th>
              <th className="col-actions" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoaded && urls.map((urlModel, index) => (
              <tr key={urlModel.id || index}>
                <td className="col-original">
                  <span className="truncate">
                    {truncateText(urlModel.targetUrl)}
                  </span>
                </td>
                <td className="col-short">
                  <a 
                    onClick={() => ({})} 
                    href={`http://localhost:3000/${urlModel.shortCode}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    http://localhost:3000/{urlModel.shortCode}
                  </a>
                </td> 
                <td className="col-date">
                  {/* Formatando a data usando o padrão nativo do JS */}
                  {new Date(urlModel.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="col-clicks">{urlModel.accessCount}</td>
                <td className="col-actions">
                  <button 
                    type="button" 
                    className="btn-copy" 
                    onClick={() => copy(urlModel.shortCode)}
                  >
                    Copiar
                  </button>
                  <button 
                    type="button" 
                    className="btn-delete" 
                    onClick={() => ({}) }
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
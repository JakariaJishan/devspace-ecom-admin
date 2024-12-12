const ExportButton = ({url, title}) => {
  const exportPdfHandler = () => {
    fetch(url, {
      'content-type': 'application/pdf',
    }).then(res => res.blob()).then((blob) => {
      console.log(blob);
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.pdf`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    })
  }
  return (
    <div className="flex justify-end my-4">
      <button
        className="block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
        onClick={exportPdfHandler}
      >
        Export PDF
      </button>
    </div>
  )
}

export default ExportButton;
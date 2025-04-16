import { useState } from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import InvoicePDF from '../components/InvoicePDF';

export default function Home() {
  const [url, setUrl] = useState('');
  const [listingData, setListingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); 

  const extractUUID = (url) => {
    const parts = url.split('-');
    const uuid = parts.slice(-5).join('-');
    return uuid;
  };

  const fetchListing = async () => {
    const uuid = extractUUID(url);
    if (!uuid) {
      return setError('Please enter a valid Garage listing URL');
    }
  
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('https://garage-backend.onrender.com/getListing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: uuid }),
      });
      
      const data = await res.json();
      // console.log(data)
      const listing = data.result?.listing;
      
      if (!listing) {
        setError("No listing found. Please check the URL and try again.");
      } else {
        setListingData(listing);
        setStep(2);// go to download step
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const [error, setError] = useState(null);

  const resetForm = () => {
    setListingData(null);
    setStep(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/logo.png" alt="Garage" className="h-9" />
        </div>
        <nav className="hidden md:block">
          <div className="flex space-x-8">
            <a href="#" className="text-gray-800 hover:text-orange-500 transition-colors py-2 font-medium">Browse</a>
            <a href="#" className="text-gray-800 hover:text-orange-500 transition-colors py-2 font-medium">Auctions</a>
            <a href="#" className="text-gray-800 hover:text-orange-500 transition-colors py-2 font-medium">Sell</a>
            <a href="#" className="text-gray-800 hover:text-orange-500 transition-colors py-2 font-medium">Appraisal</a>
            <a href="#" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors font-medium">Log in</a>
          </div>
        </nav>
        <button className="md:hidden text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Orange Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-full py-3 text-white text-center font-medium">
        <span className="flex items-center justify-center">
          <span>Get an instant free appraisal</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="px-8 py-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Invoice Generator</h1>
            <p className="text-gray-600 mb-8">Generate a professional invoice from any Garage listing in seconds</p>
            
            {/* Progress Steps */}
            <div className="flex items-center mb-8">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            </div>
            
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <>
                <div className="mb-6">
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">Listing URL</label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      id="url"
                      type="text"
                      placeholder="https://garage.com/listing-xxx-xxx"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    {url && (
                      <button 
                        onClick={() => setUrl('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Paste the full URL of the Garage listing
                  </p>
                </div>
                
                <button
                  onClick={fetchListing}
                  disabled={loading || !url}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 px-4 rounded-lg transition duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : 'Generate Invoice'}
                </button>
              </>
            )}

            {step === 2 && listingData && (
              <div className="text-center">
                <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">Invoice Ready!</h3>
                <p className="text-gray-600 mb-6">Your invoice for "{listingData.title || 'Garage listing'}" has been generated successfully.</p>
                
                <div className="space-y-4">
                  <BlobProvider document={<InvoicePDF data={listingData} />}>
                    {({ url: pdfUrl, loading: pdfLoading }) => (
                      <button 
                        disabled={pdfLoading}
                        onClick={() => {
                          if (pdfUrl) {
                            const link = document.createElement('a');
                            link.href = pdfUrl;
                            link.download = `invoice-${listingData.id || 'garage'}.pdf`;
                            link.click();
                          }
                        }}
                        className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center font-medium py-4 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                      >
                        {pdfLoading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Preparing PDF...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Invoice
                          </span>
                        )}
                      </button>
                    )}
                  </BlobProvider>
                  
                  <button
                    onClick={resetForm}
                    className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-center font-medium py-4 px-4 rounded-lg transition duration-200"
                  >
                    Generate Another Invoice
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-10">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-gray-900">How to find a listing URL</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Go to any vehicle listing on Garage and copy the URL from your browser's address bar. It should look like <span className="font-mono text-xs bg-gray-100 p-1 rounded">https://garage.com/listing-xxx-xxx-xxx</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src="/logo-white.png" alt="Garage" className="h-12 mb-4" />
              <p className="text-sm text-gray-400">The premier marketplace for automotive enthusiasts.</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Garage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
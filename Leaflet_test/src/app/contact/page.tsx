
'use client';

import Navigation from '@/components/ui/Navigation';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero sekce */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">
              Kontakt <span className="text-green-400">České spalovny</span>
            </h1>
            <p className="text-lg text-gray-300">
              Máte dotaz, návrh nebo jste našli chybu? Rádi se s vámi spojíme
            </p>
          </div>
        </div>
      </section>

      {/* Hlavní obsah */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Kontaktní informace */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">📬</span>
                  Kontaktní údaje
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1">📧</span>
                    <div>
                      <div className="font-medium text-gray-900">Email</div>                      <a href="mailto:info@ceskespalovny.cz" className="text-green-600 hover:text-green-700">
                        info@ceskespalovny.cz
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-1">📞</span>
                    <div>
                      <div className="font-medium text-gray-900">Telefon</div>
                      <a href="tel:+420123456789" className="text-blue-600 hover:text-blue-700">
                        +420 123 456 789
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="text-purple-500 mt-1">📍</span>
                    <div>
                      <div className="font-medium text-gray-900">Adresa</div>
                      <div className="text-gray-600">
                        České spalovny<br />
                        Příkladná 123<br />
                        110 00 Praha 1
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">🤝</span>
                  Spolupráce
                </h3>
                <p className="text-green-700 text-sm">
                  Zajímá vás spolupráce na projektu nebo máte data, která by mohla
                  aplikaci obohatit? Budeme rádi za každou zpětnou vazbu a návrhy na vylepšení!
                </p>
              </div>
            </div>

            {/* Kontaktní formulář */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-2xl mr-3">💬</span>
                Napište nám
              </h2>

              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Jméno *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Vaše jméno"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="vas@email.cz"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Předmět
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Předmět zprávy"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Zpráva *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Vaše zpráva..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Odeslat zprávu
                </button>
              </form>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 flex items-center">
                  <span className="mr-2">⏰</span>
                  Odpovídáme obvykle do 24 hodin
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 České spalovny | Projekt pro mapování spaloven v České republice</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

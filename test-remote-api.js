/**
 * Jednoúčelový test script pro ověření vzdáleného API
 */

import { fetchRemoteIncinerators, testRemoteApiConnection } from '../src/services/remoteApi';
import { dynamicLogger } from '../src/utils/DynamicDataLogger';

async function testRemoteApiIntegration() {
    console.log('🚀 Testování integrace vzdáleného API...\n');

    try {
        // Test připojení
        console.log('1️⃣ Test připojení...');
        const connected = await testRemoteApiConnection();
        console.log(`   Výsledek: ${connected ? '✅ Úspěšné' : '❌ Neúspěšné'}\n`);

        if (!connected) {
            console.log('❌ Přerušuji test kvůli neúspěšnému připojení');
            return;
        }

        // Test načítání dat
        console.log('2️⃣ Test načítání dat...');
        const startTime = Date.now();
        const incinerators = await fetchRemoteIncinerators();
        const loadTime = Date.now() - startTime;

        console.log(`   ✅ Načteno ${incinerators.length} spaloven za ${loadTime}ms`);
        console.log(`   📊 Struktura prvního záznamu:`);

        if (incinerators.length > 0) {
            const first = incinerators[0];
            console.log(`      - ID: ${first.id}`);
            console.log(`      - Name: ${first.name || 'N/A'}`);
            console.log(`      - Location: [${first.location.lat}, ${first.location.lng}]`);
            console.log(`      - Address: ${first.streetAddress || 'N/A'}`);
            console.log(`      - Operational: ${first.operational}`);
            console.log(`      - Year: ${first.yearEstablished || 'N/A'}`);
        }

        console.log('\n3️⃣ Test validace dat...');
        const validRecords = incinerators.filter(inc =>
            inc.location.lat && inc.location.lng &&
            inc.location.lat >= 48 && inc.location.lat <= 52 &&
            inc.location.lng >= 12 && inc.location.lng <= 19
        );

        console.log(`   ✅ ${validRecords.length}/${incinerators.length} záznamů má platné souřadnice pro ČR`);

        // Test viewport filtrování
        console.log('\n4️⃣ Test viewport filtrování...');
        const pragueArea = {
            north: 50.2,
            south: 49.9,
            east: 14.8,
            west: 14.2
        };

        const pragueIncinerators = incinerators.filter(inc => {
            const { lat, lng } = inc.location;
            return lat >= pragueArea.south && lat <= pragueArea.north &&
                lng >= pragueArea.west && lng <= pragueArea.east;
        });

        console.log(`   ✅ ${pragueIncinerators.length} spaloven v oblasti Praha`);

        console.log('\n🎉 Test vzdáleného API úspěšně dokončen!');

    } catch (error) {
        console.error('\n❌ Test vzdáleného API selhal:', error);

        if (error instanceof Error) {
            console.error(`   Chyba: ${error.message}`);
        }
    }
}

// Spuštění testu pouze pokud je soubor spuštěn přímo
if (require.main === module) {
    testRemoteApiIntegration();
}

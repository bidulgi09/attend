import dns from "dns/promises";

async function checkDomainServer(domain) {
    try {
        const address = await dns.resolve4(domain);
        return { isValid: true };
    } catch {
        return { isValid: false };
    }
}

export default checkDomainServer;
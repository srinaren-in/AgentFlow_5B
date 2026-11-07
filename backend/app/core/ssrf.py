import socket
import ipaddress
from urllib.parse import urlparse
from typing import Tuple

BLOCKED_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),      # Loopback
    ipaddress.ip_network("10.0.0.0/8"),       # Private Class A
    ipaddress.ip_network("172.16.0.0/12"),    # Private Class B
    ipaddress.ip_network("192.168.0.0/16"),   # Private Class C
    ipaddress.ip_network("169.254.0.0/16"),   # Link-local / AWS metadata
    ipaddress.ip_network("0.0.0.0/8"),        # This network
    ipaddress.ip_network("::1/128"),          # IPv6 loopback
    ipaddress.ip_network("fc00::/7"),         # IPv6 unique local
    ipaddress.ip_network("fe80::/10"),        # IPv6 link-local
]

class SSRFSecurityError(ValueError):
    """Raised when an outbound URL violates SSRF security boundaries."""
    pass

def validate_outbound_url(url: str, allow_localhost: bool = False) -> Tuple[bool, str]:
    """
    Validates that a URL is a valid web URL and does not resolve to private,
    loopback, or cloud-metadata network addresses.
    """
    if not (url.startswith("http://") or url.startswith("https://")):
        raise SSRFSecurityError("Protocol forbidden: only HTTP and HTTPS schemes are permitted.")

    parsed = urlparse(url)
    hostname = parsed.hostname

    if not hostname:
        raise SSRFSecurityError("Invalid URL: hostname could not be resolved.")

    if hostname.lower() in ["localhost", "127.0.0.1", "::1"] and not allow_localhost:
        raise SSRFSecurityError("SSRF Blocked: access to localhost is prohibited.")

    # Resolve hostname to IP addresses
    try:
        addr_info = socket.getaddrinfo(hostname, None)
        ips = {info[4][0] for info in addr_info}
    except Exception as e:
        raise SSRFSecurityError(f"DNS resolution failure for host '{hostname}': {str(e)}")

    if not allow_localhost:
        for ip_str in ips:
            ip_obj = ipaddress.ip_address(ip_str)
            for net in BLOCKED_NETWORKS:
                if ip_obj in net:
                    raise SSRFSecurityError(
                        f"SSRF Blocked: target '{hostname}' resolves to private/internal network IP '{ip_str}'."
                    )

    return True, hostname


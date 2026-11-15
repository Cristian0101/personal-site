export function PurchaseControl({ price, checkoutUrl }: { price: string; checkoutUrl: string | null }) {
  if (!checkoutUrl) return <div className="book-availability"><span className="book-availability__dot" aria-hidden="true" /><p><strong>In preparation</strong><span>Purchasing will open when the finished playbook is ready.</span></p></div>;
  return <div className="book-checkout"><a className="book-button" href={checkoutUrl}>Get the Playbook — {price}<span aria-hidden="true">↗</span></a><p className="book-fine">PDF · Secure checkout and digital delivery by Polar</p></div>;
}

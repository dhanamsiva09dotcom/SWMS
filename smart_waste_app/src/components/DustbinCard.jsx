export default function DustbinCard({ bin }) {
  const latest = bin?.latest || {};

  const fillLevel = latest.fillLevel ?? 0;

  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "15px",
      borderRadius: "10px",
      margin: "10px"
    }}>
      <h3>{bin.id}</h3>

      <p>🗑 Level: {fillLevel.toFixed(2)}%</p>
    </div>
  );
}
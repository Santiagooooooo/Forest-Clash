import React from "react";
import Card, { cards } from "./Cards/Card";

export default function Game() {
  const [playerTrees, setPlayerTrees] = React.useState(0);
  const [enemyTrees, setEnemyTrees] = React.useState(0);
  const [blocked, setBlocked] = React.useState(false);

  function playCard(card) {
    console.log("Jugaste la carta:", card);

    switch (card.type) {
      case "tree":
        if (!blocked) setPlayerTrees(t => t + card.value);
        break;

      case "fire":
        setEnemyTrees(t => Math.max(0, t - 1));
        break;

      case "lumberjack":
        if (enemyTrees > 0) {
          setEnemyTrees(t => t - 1);
          setPlayerTrees(t => t + 1);
        }
        break;

      case "politician":
        setBlocked(true);
        break;

      case "contract":
        setBlocked(false);
        break;

      case "wildfire":
        setEnemyTrees(0);
        break;

      default:
        break;
    }
  }

  return (
    <div>
      <h2>Forest Clash</h2>
      <p>Tus árboles: {playerTrees}</p>
      <p>Árboles enemigo: {enemyTrees}</p>
      {blocked && <p style={{ color: "red" }}>No puedes plantar árboles</p>}

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {cards.map(c => (
          <Card key={c.id} card={c} onPlay={playCard} />
        ))}
      </div>
    </div>
  );
}

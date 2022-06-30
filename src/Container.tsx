/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
import update from "immutability-helper";
import type { FC } from "react";
import { useCallback, useState } from "react";

import { Card } from "./Card";

export interface Item {
  id: number;
  text: string;
}

export interface ContainerState {
  cards: Item[];
}

export const Container: FC = () => {
  {
    const [cards, setCards] = useState(
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        text: `This is element no ${i + 1}`,
      }))
    );

    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
      console.log(dragIndex,'dragIndex');
      console.log(hoverIndex,'hoverIndex');
      setCards((prevCards: Item[]) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        })
      );
    }, []);

    const renderCard = useCallback(
      (card: { id: number, text: string }, index: number) => {
        return (
          <Card
            key={card.id}
            index={index}
            id={card.id}
            text={card.text}
            moveCard={moveCard}
          />
        );
      },
      []
    );

    return (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            maxHeight: "100vh",
            flexDirection: "column",
            alignContent: "flex-start",
            gap: 15,
          }}
        >
          {cards.map((card, i) => renderCard(card, i))}
        </div>
    );
  }
};

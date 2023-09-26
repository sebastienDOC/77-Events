import { useEffect, useState, Fragment } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";


const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  // Ajout d'un state pour les boutons radio du slider
  const [radioIndex, setRadioIndex] = useState(0);
  // Tri des slides par ordre décroissant
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) > new Date(evtB.date) ? - 1 : 1
  );
  
  const nextCard = () => {
    // Ajout d'une condition pour que byDateDesc contienne plus 
    // d'un élément et éviter "undefined"
    if (byDateDesc?.length > 0) {
      // Suppression slide blanche
      const realIndex = index < byDateDesc.length - 1 ? index + 1 : 0;
      setIndex(realIndex)
      setRadioIndex(realIndex)
    }
  };

  useEffect(() => {
    // Synchronisation des index
    setIndex(radioIndex);
    const timeout = setInterval(() => {
      nextCard()
    }, 5000)
    // Nettoyage de l'interval pour qu'au clic sur un
    // bouton radio, le timer recommence à zéro
    return () => {
      clearInterval(timeout);
    }
  }, [byDateDesc, index, radioIndex]);

  // Test pour synchro index radio/slide
  // useEffect(() => {
  //  console.log(`index : ${index} /` , `radioIndex : ${radioIndex}`)
  // },[radioIndex])

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <Fragment key={event.title}> 
          <div
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((_, radioIdx) => (
                <input
                  key={`btn: ${radioIdx * 1}`}
                  type="radio"
                  name="radio-button"
                  checked={radioIndex === radioIdx}
                  onChange={() => setRadioIndex(radioIdx)}
                />
              ))}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default Slider;

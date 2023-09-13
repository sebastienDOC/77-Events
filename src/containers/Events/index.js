import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginate] = useState(9);

  // Tri par ordre décroissants des events
  const byDateEvents = data?.events.sort((evtA, evtB) =>
    new Date(evtA.date) > new Date(evtB.date) ? - 1 : 1
  );
  
  const filteredEvents = (
    (!type 
      ? data?.events
      : data?.events) || []
  )
  // Fonctionnement du filtre des events
  ?.filter((event) => type === null ? event : event.type === type)
  ?.filter((event, index) => {
    if ((currentPage - 1) * paginate <= index && currentPage * paginate > index) {
      return true;
    }
    return false;}
  );
  
  const changeType = (evtType, ) => {
    setCurrentPage(1);
    setType(evtType);
  };

  const pageNumber = Math.floor((filteredEvents?.length || 0) / paginate) +1
  const typeList = new Set(data?.events.map((event) => event.type));

  return (
    <>
      {error && <div>An error occured</div>}

      {byDateEvents === null ? (
      
      // {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {filteredEvents
            ?.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;

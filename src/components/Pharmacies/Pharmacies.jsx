import React, { useState, useEffect } from "react";
import axios from "axios";
import { load } from "cheerio";

import { Container } from "react-bootstrap";

const Pharmacies = () => {
  const [pharmacies, setPharmacies] = useState([]);
  console.log(pharmacies);

  const fetchPharmacyData = async () => {
    try {
      const response = await axios.get(
        `https://www.paginegialle.it/ricerca/Farmacie/Milano%20(MI)`
      );

      const html = response.data;
      const $ = load(html);
      console.log($);

      const pharmacyData = [];

      $(".search-itm").each(function () {
        const name = $(this).find(".search-itm__sn").closest("a");
        console.log(name);

        const addressSpans = $(this).find(".search-itm__adr span");
        const address = addressSpans
          .map(function () {
            return $(this).text().trim();
          })
          .get()
          .join(", ");

        pharmacyData.push({
          name,
          address,
        });
      });

      setPharmacies(pharmacyData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPharmacyData();
  }, []);

  return (
    <>
      <Container>
        <h2>Pharmacies</h2>
        <ul>
          {pharmacies.map((pharmacy, index) => (
            <li key={index}>
              <h3>{pharmacy.name}</h3>
              <p>{pharmacy.address}</p>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
};

export default Pharmacies;

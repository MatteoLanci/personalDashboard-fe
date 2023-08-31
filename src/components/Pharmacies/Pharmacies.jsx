import React, { useState, useEffect } from "react";
import axios from "axios";
import cheerio from "cheerio";

import { Container } from "react-bootstrap";

const Pharmacies = () => {
  const [pharmacies, setPharmacies] = useState([]);
  console.log(pharmacies);

  const fetchPharmacyData = async () => {
    try {
      const response = await axios.get(
        "https://www.paginegialle.it/farmacie-turno/italia/30-08-2023/NOWOPEN"
      );

      const html = response.data;
      const $ = cheerio.load(html);
      console.log($);

      const pharmacyData = [];

      $(".search__cnt .search-itm").each(function () {
        const name = $(this).find(".search-itm__rag").text().trim();

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

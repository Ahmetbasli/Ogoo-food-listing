import React, { useState, useEffect } from "react";
import "./FoodTable.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Row, Col, Container, ListGroup } from "react-bootstrap";
import axios from "axios";

function FoodTable() {
  const [rawItems, setRawItems] = useState([]);
  const [itemsOfSelectedDate, setitemsOfSelectedDate] = useState("");

  const fetchData = async () => {
    const response = await axios.get("data.json").catch((err) => {
      console.log(err);
    });
    const items = response.data.value;
    setRawItems(items);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const GroupItemsByDate = (items) => {
    let listOfGroupedItemsByDate = [];

    items.forEach((item) => {
      let isItemPushedToList = false;
      if (listOfGroupedItemsByDate.length === 0) {
        listOfGroupedItemsByDate.push({
          date: item.fields.ItemStartDate,
          itemsByDate: [item.fields],
        });
        isItemPushedToList = true;
      }

      listOfGroupedItemsByDate.forEach((itemOfGrouped) => {
        if (
          itemOfGrouped.date === item.fields.ItemStartDate &&
          !isItemPushedToList
        ) {
          itemOfGrouped.itemsByDate.push(item.fields);
          isItemPushedToList = true;
        }
      });

      if (!isItemPushedToList) {
        listOfGroupedItemsByDate.push({
          date: item.fields.ItemStartDate,
          itemsByDate: [item.fields],
        });
      }
    });
    return listOfGroupedItemsByDate;
  };

  const categorizeForMenu = (list) => {
    let listOfGroupedItemsByCategory = [];
    list.itemsByDate.forEach((item) => {
      let isItemPushedToList = false;
      if (listOfGroupedItemsByCategory.length === 0) {
        listOfGroupedItemsByCategory.push({
          category: item.FoodCategory,
          itemsByCategory: [item],
        });
        isItemPushedToList = true;
      }

      listOfGroupedItemsByCategory.forEach((itemOfGrouped) => {
        if (
          itemOfGrouped.category === item.FoodCategory &&
          !isItemPushedToList
        ) {
          itemOfGrouped.itemsByCategory.push(item);
          isItemPushedToList = true;
        }
      });

      if (!isItemPushedToList) {
        listOfGroupedItemsByCategory.push({
          category: item.FoodCategory,
          itemsByCategory: [item],
        });
      }
    });

    //list in alphabetical order
    listOfGroupedItemsByCategory.sort(function (a, b) {
      return a.category.localeCompare(b.category);
    });

    return listOfGroupedItemsByCategory;
  };

  const listOfGroupedItemsByDate = GroupItemsByDate(rawItems);

  const listOfGroupedItemsByCategory =
    rawItems.length === 0
      ? ""
      : categorizeForMenu(
          !itemsOfSelectedDate
            ? listOfGroupedItemsByDate[0]
            : itemsOfSelectedDate
        );

  const prepareNiceLookingDropdownDate = (garbageLookingDate) => {
    let dateForDropdown = garbageLookingDate.split("-");
    dateForDropdown = [
      dateForDropdown[0],
      dateForDropdown[1],
      dateForDropdown[2].slice(0, 2),
    ]
      .reverse()
      .join(".");
    return dateForDropdown;
  };

  const handleSelect = (e) => {
    setitemsOfSelectedDate(e);
  };

  return (
    <div>
      {rawItems.length !== 0 && (
        <Container>
          <Row className="px-0">
            <Col xs={6} md={3}>
              <Dropdown>
                <div>
                  <Dropdown.Toggle
                    className="dropDown mb-2"
                    variant="border  border-dark outline-light"
                  >
                    {prepareNiceLookingDropdownDate(
                      !itemsOfSelectedDate
                        ? listOfGroupedItemsByDate[0].date
                        : itemsOfSelectedDate.date
                    )}
                  </Dropdown.Toggle>
                </div>

                <Dropdown.Menu className="dropDownMenu">
                  {listOfGroupedItemsByDate.map((item) => (
                    <Dropdown.Item
                      onSelect={() => handleSelect(item)}
                      key={item.date}
                    >
                      {prepareNiceLookingDropdownDate(item.date)}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col xs={12} md={9}>
              <Row>
                {listOfGroupedItemsByCategory.map((item) => (
                  <Col
                    className="px-0 my-0"
                    xs={12}
                    lg={4}
                    md={6}
                    key={item.category}
                  >
                    <ListGroup
                      md={12}
                      className="items"
                      key={item.category}
                      variant="flush"
                    >
                      <ListGroup.Item variant="dark">
                        <div className="header">
                          <h2>{item.category}</h2>
                          <h3>Kcal</h3>
                        </div>
                      </ListGroup.Item>

                      {item.itemsByCategory.map((itemOfCategory) => (
                        <ListGroup.Item key={itemOfCategory.id}>
                          <div className="detail">
                            <h2>{itemOfCategory.Title} </h2>
                            <h3>{itemOfCategory.Calorie}</h3>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}

export default FoodTable;

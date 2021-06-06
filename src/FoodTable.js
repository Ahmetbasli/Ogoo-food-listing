import React from "react";
import "./FoodTable.css";
import Data from "./data.json";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Row, Col, Container, ListGroup } from "react-bootstrap";

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
const listOfGroupedItemsByDate = GroupItemsByDate(Data.value);

function FoodTable() {
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
    listOfGroupedItemsByCategory = listOfGroupedItemsByCategory.sort(function (
      a,
      b
    ) {
      if (a.category < b.category) {
        return -1;
      }
      if (a.category > b.category) {
        return 1;
      }
      return 0;
    });

    return listOfGroupedItemsByCategory;
  };

  const [itemsOfSelectedDate, setitemsOfSelectedDate] = React.useState(
    listOfGroupedItemsByDate[0]
  );

  const listOfGroupedItemsByCategory = categorizeForMenu(itemsOfSelectedDate);

  const prepareDropdownDate = (garbageLookingDate) => {
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
  const dateForDropdown = prepareDropdownDate(listOfGroupedItemsByDate[0].date);

  const handleSelect = (e) => {
    setitemsOfSelectedDate(e);
  };

  return (
    <div>
      <Container>
        <Row className="px-0">
          <Col xs={6} md={3}>
            <Dropdown>
              <div>
                <Dropdown.Toggle
                  className="dropDown mb-2"
                  variant="border  border-dark outline-light"
                >
                  {dateForDropdown}
                </Dropdown.Toggle>
              </div>

              <Dropdown.Menu className="dropDownMenu">
                {listOfGroupedItemsByDate.map((item) => (
                  <Dropdown.Item
                    onSelect={() => handleSelect(item)}
                    key={item.date}
                  >
                    {prepareDropdownDate(item.date)}
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
    </div>
  );
}

export default FoodTable;

import PointsListView from '../view/points-list-view';
import PointsEmptyView from '../view/points-empty-view';
import { render } from '../framework/render';
import { EmptyPhrase } from '../const';
import PointPresenter from './point-presenter';
import { updateItem } from '../utils/common';

export default class MainPresenter {
  #container = null;
  #pointsModel = null;
  #pointsList = new PointsListView();
  #points = [];
  #offersModel = [];
  #destinationsModel = [];
  #pointPresenters = new Map;

  constructor({ container, pointsModel, offersModel, destinationsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#points = [...this.#pointsModel.points];
  }

  init() {
    if (!this.#points.length) {
      this.#renderPointsEmptyList();
      return;
    }

    this.#renderPointsList();
  }

  #renderPointsEmptyList() {
    render(new PointsEmptyView({ message: EmptyPhrase.NO_FUTURE_POINTS }), this.#container);
  }

  #pointChangeHandler = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPointsList() {
    render(this.#pointsList, this.#container);
    this.#renderPoints(this.#points);
  }

  #renderPoints() {
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsListComponent: this.#pointsList,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#pointChangeHandler
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => {
      presenter.destroy();
    });
    this.#pointPresenters.clear();
  }
}

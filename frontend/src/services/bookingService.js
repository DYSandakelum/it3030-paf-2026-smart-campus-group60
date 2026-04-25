import axios from "axios";
import { clearAuthToken, getAuthToken } from "../auth/token.js";

const api = axios.create({
  baseURL: "http://localhost:8081/api/bookings",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthToken();
      return Promise.reject(new Error("Session expired. Please sign in again."));
    }

    return Promise.reject(error);
  }
);

const unwrapData = (response) => response?.data?.data ?? response?.data ?? null;

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Unable to complete the request";

export const getAllBookings = async (filters = {}) => {
  try {
    const params = {};

    if (filters.userId) {
      params.userId = filters.userId;
    }

    if (filters.status) {
      params.status = filters.status;
    }

    const response = await api.get("", { params });
    return unwrapData(response);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return unwrapData(response);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createBooking = async (booking) => {
  try {
    const response = await api.post("", booking);
    return unwrapData(response);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateBooking = async (id, booking) => {
  try {
    const response = await api.put(`/${id}`, booking);
    return unwrapData(response);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateStatus = async (id, status) => {
  try {
    const response = await api.patch(`/${id}/status`, { status });
    return unwrapData(response);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteBooking = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return unwrapData(response);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
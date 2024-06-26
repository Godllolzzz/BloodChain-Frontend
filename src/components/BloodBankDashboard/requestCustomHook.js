import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useSocketContext } from "@/store/SocketContext";

let initialState = {
  "O+": 0,
  "O-": 0,
  "A+": 0,
  "A-": 0,
  "B+": 0,
  "B-": 0,
  "AB+": 0,
  "AB-": 0,
};

export const useRequestManagement = () => {
  const { userId } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [amount, setAmount] = useState(initialState);
  const { socket } = useSocketContext();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        process.env.NEXT_PUBLIC_SERVER_URL + `/request/${userId}`
      );
      let data = response.data.data.filter(
        (request) => request.request_status === "Approved"
      );
      setApprovedRequests(data);
      data = [];
      data = response.data.data.filter(
        (request) => request.request_status === "Requested"
      );
      setPendingRequests(data);
      setLoading(false);
      //   console.log(response.data);
      //   console.log(approvedRequests);
      //   console.log(pendingRequests);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        process.env.NEXT_PUBLIC_SERVER_URL + `/bloodbank/inventory/${userId}`
      );
      // setProfile(response.data);
      initialState = {
        "O+": 0,
        "O-": 0,
        "A+": 0,
        "A-": 0,
        "B+": 0,
        "B-": 0,
        "AB+": 0,
        "AB-": 0,
      };
      response.data.forEach((donation) => {
        initialState[donation.blood_type] = donation.count;
      });
      setAmount(initialState);
      setLoading(false);
      //   console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchData();
  }, [userId]);

  const acceptRequest = async (id, hid) => {
    console.log(id);
    // console.log(pendingRequests);
    // console.log(approvedRequests);
    try {
      const response = await axios.patch(
        process.env.NEXT_PUBLIC_SERVER_URL + `/request/approved`,
        {
          requestId: id,
        }
      );
      console.log(response);

      if (socket && typeof socket.emit === "function") {
        socket.emit("approveBloodRequest", {
          message: "Hospital Request Accepted",
          bloodbankId: userId,
          hospitalId: hid,
        });
      } else {
        console.error(
          "Socket is not properly initialized or emit method is not available."
        );
      }

      const approvedRequest = pendingRequests.find(
        (request) => request.request_id === id
      );
      const updatedPendingRequests = pendingRequests.filter(
        (request) => request.request_id !== id
      );

      setPendingRequests(updatedPendingRequests);

      setApprovedRequests((prevApprovedRequests) => [
        ...prevApprovedRequests,
        approvedRequest,
      ]);

      initialState = amount;
      initialState[approvedRequest.blood_type]--;
      // initialState = [amount[approvedRequest.blood_type]--, ...amount];
      setAmount(initialState);
      //   console.log(pendingRequests);
      //   console.log(approvedRequests);
    } catch (error) {
      console.log(error);
    }
  };

  const rejectRequest = async (id, hid) => {
    console.log(id);
    try {
      const response = await axios.patch(
        process.env.NEXT_PUBLIC_SERVER_URL + `/request/rejected`,
        {
          requestId: id,
        }
      );
      console.log(response);
      if (socket && typeof socket.emit === "function") {
        socket.emit("rejectBloodRequest", {
          message: "Hospital Request Rejected",
          bloodbankId: userId,
          hospitalId: hid,
        });
      } else {
        console.error(
          "Socket is not properly initialized or emit method is not available."
        );
      }
      const updatedPendingRequests = pendingRequests.filter(
        (request) => request.request_id !== id
      );

      setPendingRequests(updatedPendingRequests);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    loading,
    amount,
    rejectRequest,
    acceptRequest,
    approvedRequests,
    pendingRequests,
  };
};

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addLog } from "../utils/db"; // ✅ import SQLite function

export default function AddLog({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [priority, setPriority] = useState("Medium");

  const [dailyReminder, setDailyReminder] = useState(false);
  const [reminderDays, setReminderDays] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDuePicker, setShowDuePicker] = useState(false);

  const toggleDay = (day: string) => {
    if (reminderDays.includes(day)) {
      setReminderDays(reminderDays.filter((d) => d !== day));
    } else {
      setReminderDays([...reminderDays, day]);
    }
  };

  const handleAddLog = () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Title is required");
      return;
    }

    // Prepare values for DB
    const startDateStr = startDate.toLocaleDateString();
    const dueDateStr = dueDate ? dueDate.toLocaleDateString() : null;
    const reminderDaysStr = dailyReminder ? reminderDays.join(",") : "";

    // Save to SQLite
    addLog(
      title,
      description,
      priority,
      startDateStr,
      reminderDaysStr,
      "Pending" // default status
    );

    Alert.alert("Success", "Log saved ✅");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: "#007AFF", fontSize: 16 }}>Back</Text>
        </TouchableOpacity>

        {/* --- Mandatory Section --- */}
        <Text style={styles.sectionTitle}>Mandatory</Text>

        {/* Title */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter Title"
        />

        {/* Reminder Begin On */}
        <Text style={styles.label}>Reminders Begin On</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartPicker(true)}
        >
          <Text>{startDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            minimumDate={new Date()}
            onChange={(e, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        )}

        {/* Priority */}
        <Text style={styles.label}>Priority</Text>
        <View style={styles.row}>
          {["High", "Medium", "Low"].map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.priorityButton,
                priority === p && styles.prioritySelected,
              ]}
              onPress={() => setPriority(p)}
            >
              <Text
                style={{
                  color: priority === p ? "#fff" : "#000",
                  fontWeight: "600",
                }}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* --- Optional Section --- */}
        <Text style={styles.sectionTitle}>Optional</Text>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter Description"
        />

        {/* Daily Reminder */}
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Daily Reminder</Text>
          <Switch value={dailyReminder} onValueChange={setDailyReminder} />
        </View>

        {dailyReminder && (
          <>
            {/* Reminder Days */}
            <Text style={styles.label}>Remind On</Text>
            <View style={styles.rowWrap}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    reminderDays.includes(day) && styles.daySelected,
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text
                    style={{
                      color: reminderDays.includes(day) ? "#fff" : "#000",
                    }}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Due Date */}
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDuePicker(true)}
            >
              <Text>{dueDate ? dueDate.toLocaleDateString() : "Select Date"}</Text>
            </TouchableOpacity>
            {showDuePicker && (
              <DateTimePicker
                value={dueDate || new Date()}
                mode="date"
                minimumDate={startDate}
                onChange={(e, selectedDate) => {
                  setShowDuePicker(false);
                  if (selectedDate) setDueDate(selectedDate);
                }}
              />
            )}
          </>
        )}
      </ScrollView>

      {/* Fixed Add Log Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddLog}>
        <Text style={styles.addButtonText}>Add Log</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButton: { alignSelf: "flex-end", margin: 15 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    marginLeft: 15,
    color: "#333",
  },
  label: { fontSize: 14, fontWeight: "600", marginTop: 10, marginLeft: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    marginHorizontal: 15,
  },
  row: { flexDirection: "row", marginLeft: 15, marginTop: 5 },
  priorityButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  prioritySelected: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 15,
    marginHorizontal: 15,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 10,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 15,
    marginTop: 5,
  },
  dayButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    margin: 3,
  },
  daySelected: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

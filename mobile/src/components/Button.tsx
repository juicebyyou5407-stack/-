import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { colors, spacing } from "../theme";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "danger" | "secondary";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ title, onPress, variant = "primary", loading, disabled, style }: Props) {
  const backgroundColor =
    variant === "primary" ? colors.primary : variant === "danger" ? colors.danger : colors.surface;
  const textColor = variant === "secondary" ? colors.text : "#FFFFFF";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor, opacity: disabled ? 0.5 : 1 },
        variant === "secondary" && styles.secondaryBorder,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing(1.5),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBorder: { borderWidth: 1, borderColor: colors.border },
  text: { fontSize: 16, fontWeight: "700" },
});

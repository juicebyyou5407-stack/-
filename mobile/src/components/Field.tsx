import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors, spacing } from "../theme";

type Props = TextInputProps & { label: string };

export function Field({ label, style, ...rest }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.textMuted}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing(2) },
  label: { fontSize: 13, color: colors.textMuted, marginBottom: 4, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(1.2),
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.text,
  },
});

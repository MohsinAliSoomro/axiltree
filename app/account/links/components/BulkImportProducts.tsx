"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  FileInput,
  Group,
  List,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { IconAlertCircle, IconCheck, IconUpload } from "@tabler/icons-react";
import { createClient } from "@/app/lib/supabase/client";

type ParsedRow = {
  title: string;
  buy_url: string;
  price: number | null;
  image_url: string | null;
  is_active: boolean;
  position: number;
  publish_at: string | null;
  expire_at: string | null;
};

type ImportError = {
  row: number;
  message: string;
};

const parseBoolean = (value: unknown, fallback = true) => {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "y", "live", "active"].includes(normalized)) return true;
  if (["false", "0", "no", "n", "draft", "inactive"].includes(normalized)) return false;
  return fallback;
};

const parseNumber = (value: unknown) => {
  if (value === null || value === undefined || value === "") return null;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : Number.NaN;
};

const looksLikeUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const parseCsvLine = (line: string): string[] => {
  const values: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
};

const parseCsvText = (text: string) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return [] as Record<string, string>[];
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase());

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};

    headers.forEach((header, headerIndex) => {
      row[header] = values[headerIndex] ?? "";
    });

    return row;
  });
};

const pickValue = (row: Record<string, any>, keys: string[]) => {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) return row[key];
  }
  return undefined;
};

const normalizeRows = (rows: Record<string, any>[]) => {
  const normalizedRows: ParsedRow[] = [];
  const errors: ImportError[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const titleRaw = pickValue(row, ["title", "name", "product_name"]);
    const buyUrlRaw = pickValue(row, ["buy_url", "url", "link", "product_url"]);
    const imageUrlRaw = pickValue(row, ["image_url", "image", "imageurl"]);
    const priceRaw = pickValue(row, ["price", "amount"]);
    const isActiveRaw = pickValue(row, ["is_active", "active", "status"]);
    const positionRaw = pickValue(row, ["position", "order"]);
    const publishAtRaw = pickValue(row, ["publish_at", "publishat"]);
    const expireAtRaw = pickValue(row, ["expire_at", "expireat"]);

    const title = typeof titleRaw === "string" ? titleRaw.trim() : "";
    const buyUrl = typeof buyUrlRaw === "string" ? buyUrlRaw.trim() : "";
    const imageUrl = typeof imageUrlRaw === "string" ? imageUrlRaw.trim() : "";

    if (!title) {
      errors.push({ row: rowNumber, message: "Missing required field: title" });
      return;
    }

    if (!buyUrl || !looksLikeUrl(buyUrl)) {
      errors.push({ row: rowNumber, message: "Missing or invalid buy_url" });
      return;
    }

    if (imageUrl && !looksLikeUrl(imageUrl)) {
      errors.push({ row: rowNumber, message: "Invalid image_url" });
      return;
    }

    const priceValue = parseNumber(priceRaw);
    if (Number.isNaN(priceValue)) {
      errors.push({ row: rowNumber, message: "Invalid price (must be numeric)" });
      return;
    }

    const positionValue = parseNumber(positionRaw);
    const position = Number.isNaN(positionValue) || positionValue === null
      ? index
      : Math.max(0, Math.floor(positionValue));

    const publishAt =
      typeof publishAtRaw === "string" && publishAtRaw.trim().length > 0
        ? publishAtRaw.trim()
        : null;
    const expireAt =
      typeof expireAtRaw === "string" && expireAtRaw.trim().length > 0
        ? expireAtRaw.trim()
        : null;

    if (publishAt && Number.isNaN(Date.parse(publishAt))) {
      errors.push({ row: rowNumber, message: "Invalid publish_at date" });
      return;
    }

    if (expireAt && Number.isNaN(Date.parse(expireAt))) {
      errors.push({ row: rowNumber, message: "Invalid expire_at date" });
      return;
    }

    if (publishAt && expireAt && new Date(expireAt) <= new Date(publishAt)) {
      errors.push({ row: rowNumber, message: "expire_at must be after publish_at" });
      return;
    }

    normalizedRows.push({
      title,
      buy_url: buyUrl,
      image_url: imageUrl || null,
      price: priceValue,
      is_active: parseBoolean(isActiveRaw, true),
      position,
      publish_at: publishAt,
      expire_at: expireAt,
    });
  });

  return { normalizedRows, errors };
};

interface BulkImportProductsProps {
  profileId?: string;
  onImported?: (count: number) => void;
}

export default function BulkImportProducts({ profileId, onImported }: BulkImportProductsProps) {
  const supabase = createClient();
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string>("");

  const canImport = useMemo(
    () => Boolean(profileId) && rows.length > 0 && errors.length === 0 && !isImporting,
    [profileId, rows.length, errors.length, isImporting]
  );

  const parseFile = async () => {
    if (!file) return;
    setIsParsing(true);
    setResultMessage("");
    setRows([]);
    setErrors([]);

    try {
      const content = await file.text();
      const lowerName = file.name.toLowerCase();

      let rawRows: Record<string, any>[] = [];
      if (lowerName.endsWith(".json")) {
        const json = JSON.parse(content);
        if (!Array.isArray(json)) {
          setErrors([{ row: 1, message: "JSON must be an array of objects" }]);
          return;
        }
        rawRows = json as Record<string, any>[];
      } else if (lowerName.endsWith(".csv")) {
        rawRows = parseCsvText(content);
      } else {
        setErrors([{ row: 1, message: "Only .csv and .json files are supported" }]);
        return;
      }

      if (!rawRows.length) {
        setErrors([{ row: 1, message: "No rows found in file" }]);
        return;
      }

      const { normalizedRows, errors: validationErrors } = normalizeRows(rawRows);
      setRows(normalizedRows);
      setErrors(validationErrors);

      if (!validationErrors.length) {
        setResultMessage(`Parsed ${normalizedRows.length} valid rows. Ready to import.`);
      }
    } catch {
      setErrors([{ row: 1, message: "Failed to parse file. Check JSON/CSV format." }]);
    } finally {
      setIsParsing(false);
    }
  };

  const importRows = async () => {
    if (!profileId || !canImport) return;
    setIsImporting(true);
    setResultMessage("");

    try {
      let insertedCount = 0;
      const batchSize = 100;

      for (let index = 0; index < rows.length; index += batchSize) {
        const batch = rows.slice(index, index + batchSize).map((row) => ({
          profile_id: profileId,
          ...row,
        }));

        const { error } = await supabase.from("products").insert(batch);
        if (error) {
          setResultMessage(`Import failed: ${error.message}`);
          setIsImporting(false);
          return;
        }

        insertedCount += batch.length;
      }

      setResultMessage(`Successfully imported ${insertedCount} products.`);
      onImported?.(insertedCount);
      setFile(null);
      setRows([]);
      setErrors([]);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Stack gap="sm">
      <Text size="sm" c="dimmed">
        Upload CSV or JSON with fields: title, buy_url, price, image_url, is_active, position, publish_at, expire_at.
      </Text>

      <FileInput
        label="Choose CSV/JSON file"
        placeholder="products.csv or products.json"
        value={file}
        onChange={setFile}
        accept=".csv,.json,application/json,text/csv"
      />

      <Group>
        <Button
          leftSection={<IconCheck size={16} />}
          onClick={parseFile}
          loading={isParsing}
          disabled={!file}
          variant="light"
        >
          Validate File
        </Button>

        <Button
          leftSection={<IconUpload size={16} />}
          onClick={importRows}
          loading={isImporting}
          disabled={!canImport}
        >
          Import Products
        </Button>
      </Group>

      {resultMessage && (
        <Alert color="blue" variant="light">
          {resultMessage}
        </Alert>
      )}

      {(rows.length > 0 || errors.length > 0) && <Divider />}

      {errors.length > 0 && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" title="Validation Errors">
          <List spacing={4} size="sm">
            {errors.slice(0, 10).map((errorItem, index) => (
              <List.Item key={`${errorItem.row}-${index}`}>
                Row {errorItem.row}: {errorItem.message}
              </List.Item>
            ))}
          </List>
          {errors.length > 10 && (
            <Text size="xs" mt={6}>
              +{errors.length - 10} more errors
            </Text>
          )}
        </Alert>
      )}

      {rows.length > 0 && (
        <Box>
          <Group justify="space-between" mb={6}>
            <Text fw={600} size="sm">
              Preview
            </Text>
            <Badge variant="light" color="teal">
              {rows.length} valid rows
            </Badge>
          </Group>

          <Table striped withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Title</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Buy URL</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.slice(0, 6).map((row, index) => (
                <Table.Tr key={`${row.buy_url}-${index}`}>
                  <Table.Td>{row.title}</Table.Td>
                  <Table.Td>{row.price === null ? "-" : row.price}</Table.Td>
                  <Table.Td>{row.is_active ? "Live" : "Draft"}</Table.Td>
                  <Table.Td>
                    <Text size="xs" truncate="end" maw={220}>
                      {row.buy_url}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          {rows.length > 6 && (
            <Text size="xs" c="dimmed" mt={6}>
              Showing first 6 rows only.
            </Text>
          )}
        </Box>
      )}
    </Stack>
  );
}

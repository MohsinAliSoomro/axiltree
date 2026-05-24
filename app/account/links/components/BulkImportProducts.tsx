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
  Select,
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

type FieldMap = {
  title: string[];
  buy_url: string[];
  image_url: string[];
  price: string[];
  is_active: string[];
  position: string[];
  publish_at: string[];
  expire_at: string[];
};

type ProductField = keyof FieldMap;

type ColumnMapping = Record<ProductField, string | null>;

const PRODUCT_FIELDS: Array<{ key: ProductField; label: string; required?: boolean }> = [
  { key: "title", label: "Title", required: true },
  { key: "buy_url", label: "Buy URL", required: true },
  { key: "image_url", label: "Image URL" },
  { key: "price", label: "Price" },
  { key: "is_active", label: "Status" },
  { key: "position", label: "Position" },
  { key: "publish_at", label: "Publish At" },
  { key: "expire_at", label: "Expire At" },
];

const PRODUCT_FIELD_MAP: FieldMap = {
  title: [
    "title",
    "name",
    "product_name",
    "productName",
    "product_title",
    "productTitle",
    "item_name",
    "itemName",
  ],
  buy_url: [
    "buy_url",
    "buyUrl",
    "url",
    "link",
    "product_url",
    "productUrl",
    "buy_link",
    "buyLink",
    "checkout_url",
    "checkoutUrl",
  ],
  image_url: [
    "image_url",
    "imageUrl",
    "image",
    "imageurl",
    "thumbnail",
    "thumbnailUrl",
    "photo",
    "photoUrl",
    "img",
    "imgUrl",
  ],
  price: ["price", "amount", "cost", "sale_price", "salePrice", "value"],
  is_active: ["is_active", "isActive", "active", "status", "live"],
  position: ["position", "order", "sort", "sortOrder", "index", "rank"],
  publish_at: ["publish_at", "publishAt", "start_at", "startAt", "startsAt"],
  expire_at: ["expire_at", "expireAt", "end_at", "endAt", "endsAt"],
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

const getSourceRow = (row: Record<string, any>) => {
  if (row.product && typeof row.product === "object") return row.product as Record<string, any>;
  if (row.data && typeof row.data === "object") return row.data as Record<string, any>;
  if (row.item && typeof row.item === "object") return row.item as Record<string, any>;
  return row;
};

const resolveMappedValue = (row: Record<string, any>, fieldKeys: string[]) => {
  const sourceRow = getSourceRow(row);
  return pickValue(sourceRow, fieldKeys);
};

const getRowKeys = (row: Record<string, any>) => {
  const sourceRow = getSourceRow(row);
  return Object.keys(sourceRow);
};

const normalizeKey = (value: string) =>
  value
    .replace(/[_\s-]+/g, "")
    .toLowerCase();

const autoDetectColumn = (availableColumns: string[], aliases: string[]) => {
  const normalizedColumns = availableColumns.map((column) => ({
    column,
    normalized: normalizeKey(column),
  }));

  for (const alias of aliases) {
    const normalizedAlias = normalizeKey(alias);
    const exact = normalizedColumns.find((item) => item.normalized === normalizedAlias);
    if (exact) return exact.column;
  }

  return null;
};

const buildDefaultMapping = (availableColumns: string[]): ColumnMapping => ({
  title: autoDetectColumn(availableColumns, PRODUCT_FIELD_MAP.title),
  buy_url: autoDetectColumn(availableColumns, PRODUCT_FIELD_MAP.buy_url),
  image_url: autoDetectColumn(availableColumns, PRODUCT_FIELD_MAP.image_url),
  price: autoDetectColumn(availableColumns, PRODUCT_FIELD_MAP.price),
  is_active: autoDetectColumn(availableColumns, PRODUCT_FIELD_MAP.is_active),
  position: autoDetectColumn(availableColumns, PRODUCT_FIELD_MAP.position),
  publish_at: autoDetectColumn(availableColumns, PRODUCT_FIELD_MAP.publish_at),
  expire_at: autoDetectColumn(availableColumns, PRODUCT_FIELD_MAP.expire_at),
});

const readMappedValue = (
  row: Record<string, any>,
  mapping: ColumnMapping,
  field: ProductField,
  aliases: string[]
) => {
  const sourceRow = getSourceRow(row);
  const mappedColumn = mapping[field];
  if (mappedColumn && sourceRow[mappedColumn] !== undefined && sourceRow[mappedColumn] !== null) {
    return sourceRow[mappedColumn];
  }

  return resolveMappedValue(row, aliases);
};

const normalizeRows = (rows: Record<string, any>[], mapping: ColumnMapping) => {
  const normalizedRows: ParsedRow[] = [];
  const errors: ImportError[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const titleRaw = readMappedValue(row, mapping, "title", PRODUCT_FIELD_MAP.title);
    const buyUrlRaw = readMappedValue(row, mapping, "buy_url", PRODUCT_FIELD_MAP.buy_url);
    const imageUrlRaw = readMappedValue(row, mapping, "image_url", PRODUCT_FIELD_MAP.image_url);
    const priceRaw = readMappedValue(row, mapping, "price", PRODUCT_FIELD_MAP.price);
    const isActiveRaw = readMappedValue(row, mapping, "is_active", PRODUCT_FIELD_MAP.is_active);
    const positionRaw = readMappedValue(row, mapping, "position", PRODUCT_FIELD_MAP.position);
    const publishAtRaw = readMappedValue(row, mapping, "publish_at", PRODUCT_FIELD_MAP.publish_at);
    const expireAtRaw = readMappedValue(row, mapping, "expire_at", PRODUCT_FIELD_MAP.expire_at);

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
  const [sourceColumns, setSourceColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    title: null,
    buy_url: null,
    image_url: null,
    price: null,
    is_active: null,
    position: null,
    publish_at: null,
    expire_at: null,
  });
  const [rawRows, setRawRows] = useState<Record<string, any>[]>([]);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string>("");

  const canImport = useMemo(
    () => Boolean(profileId) && rows.length > 0 && errors.length === 0 && !isImporting,
    [profileId, rows.length, errors.length, isImporting]
  );

  const mappingOptions = useMemo(
    () => sourceColumns.map((column) => ({ value: column, label: column })),
    [sourceColumns]
  );

  const applyMapping = () => {
    if (!rawRows.length) return;

    const { normalizedRows, errors: validationErrors } = normalizeRows(rawRows, columnMapping);
    setRows(normalizedRows);
    setErrors(validationErrors);

    if (!validationErrors.length) {
      setResultMessage(`Parsed ${normalizedRows.length} valid rows. Ready to import.`);
    }
  };

  const parseFile = async () => {
    if (!file) return;
    setIsParsing(true);
    setResultMessage("");
    setRows([]);
    setErrors([]);
    setRawRows([]);
    setSourceColumns([]);

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

      setRawRows(rawRows);

      const columns = Array.from(
        new Set(rawRows.flatMap((row) => getRowKeys(row)).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b));
      setSourceColumns(columns);

      const defaultMapping = buildDefaultMapping(columns);
      setColumnMapping(defaultMapping);

      const { normalizedRows, errors: validationErrors } = normalizeRows(rawRows, defaultMapping);
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
        Upload CSV or JSON with code fields like title/name/productName, buyUrl/url, price/amount, imageUrl/image, isActive/status, position/order, publishAt, expireAt.
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

      {sourceColumns.length > 0 && (
        <Box>
          <Group justify="space-between" mb={6}>
            <Text fw={600} size="sm">
              Column Mapping
            </Text>
            <Text size="xs" c="dimmed">
              Map your file columns to product fields
            </Text>
          </Group>

          <Stack gap="xs">
            {PRODUCT_FIELDS.map((field) => (
              <Select
                key={field.key}
                label={field.label}
                placeholder={field.required ? "Required field" : "Optional field"}
                data={mappingOptions}
                value={columnMapping[field.key]}
                onChange={(value) =>
                  setColumnMapping((prev) => ({
                    ...prev,
                    [field.key]: value,
                  }))
                }
                clearable={!field.required}
                searchable
                nothingFoundMessage="No column found"
                description={
                  field.required
                    ? "Required"
                    : `Optional. Leave blank if your file does not include this field.`
                }
              />
            ))}

            <Group justify="flex-end">
              <Button variant="light" onClick={applyMapping} disabled={!rawRows.length}>
                Apply Mapping
              </Button>
            </Group>
          </Stack>
        </Box>
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

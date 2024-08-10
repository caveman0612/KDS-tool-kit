# // View data - SN Utils
import os

# $ , / ? % # [ ]




convert = {
    " ":  "%20",
    # "   ":  "%20%20%20%20",
    "=":  "%3D",
    "(":  "%28",
    '"':  "%22",
    ")":  "%29",
    ";":  "%3B",
    "\n":  "%0A",
    "{":  "%7B",
    "}":  "%7D",
    "'":  "%27",
    "+":  "%2b",
    "!":  "%21",
    "*":  "%2a",
    ":":  "%3a",
    "@":  "%40",
    "&":  "%26",
    ",":  "%2c",
    "/":  "%2f",
    "?":  "%3f",
    "#":  "%23",
    "[":  "%5b",
    "]":  "%5d",
}

url = "/sys.scripts.do?content="

path = "1main/Python/sn_utils_parse/"

print("--------------start----------------------")
print()
dn = os.path.abspath(path + "script_to_parse.js")

with open(dn, 'r') as f2:
    lines = f2.readlines()
    for line in lines:
        # print("'" + line + "'")
        # if line == " " or line == "\n":
        #     continue
        for item in line:
            if item in convert:
                data = convert[item]
            else:
                data = item

            # print("'" + data + "'" + "-", data.isspace())
            if data.isspace():
                url += "%20%20%20%20"
            else:
                url += data


dn = os.path.abspath(path + "parse_string.txt")

with open(dn, 'w') as f3:
    f3.write(url)

# print(url)

print("-------------end---------------")
